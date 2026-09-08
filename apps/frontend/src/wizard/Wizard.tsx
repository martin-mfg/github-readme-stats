import { StrictMode, useEffect, useState } from "react";
import type { JSX } from "react";
import { Provider, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { clearAxiosCache } from "../axios-override";
import {
  useIsAuthenticated,
  useUserKey,
  useUserToken,
} from "../redux/selectors/userSelectors";
import {
  logout as _logout,
  setUserAccess as _setUserAccess,
} from "../redux/slices/user";
import { store } from "../redux/store";

import { HomeScreen } from "./Home/Home";
import { getUserMetadata } from "./api/user";
import { ProgressBar } from "./components/Home/Progress";
import { STAGE_LABELS } from "./models/Stage";
import type { StageIndex } from "./models/Stage";
import { useIsDarkTheme } from "./useIsDarkTheme";

const toMessage = (
  input: string | ErrorEvent | PromiseRejectionEvent,
): string => {
  if (typeof input === "string") {
    return input;
  }
  type MaybeErrorReason = { message: string } | null;
  const reason = ("reason" in input ? input.reason : null) as MaybeErrorReason;
  if (typeof reason?.message === "string" && !!reason.message.trim()) {
    return reason.message;
  }

  if ("message" in input && input.message) {
    return input.message;
  }

  try {
    return JSON.stringify(input);
  } catch {
    return "Unknown error";
  }
};

const showError = (event: ErrorEvent | PromiseRejectionEvent): void => {
  toast.error(toMessage(event), {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
  });
};

const STAGE_TITLES = STAGE_LABELS.map((it) => it.shortTitle);

function WizardApp(): JSX.Element {
  const userKey = useUserKey();
  const userToken = useUserToken();
  const isAuthenticated = useIsAuthenticated();
  const isDark = useIsDarkTheme();

  const [stage, setStage] = useState<StageIndex>(isAuthenticated ? 1 : 0);

  const dispatch = useDispatch();

  useEffect(() => {
    const handler = (event: ErrorEvent | PromiseRejectionEvent) => {
      showError(event);
    };

    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler);

    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);

  useEffect(() => {
    clearAxiosCache();
  }, [userToken]);

  /*
   * Advance to step 1 only when `isAuthenticated` transitions, so a logged-in user can still navigate back to step 0.
   * Tracked during render (comparing the previous value) rather than in an effect:
   * https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
   */
  {
    const [prevIsAuthenticated, setPrevIsAuthenticated] =
      useState(isAuthenticated);
    if (isAuthenticated !== prevIsAuthenticated) {
      setPrevIsAuthenticated(isAuthenticated);
      if (isAuthenticated && stage === 0) {
        setStage(1);
      }
    }
  }

  useEffect(() => {
    async function getPrivateAccess() {
      if (userKey && userKey.length > 0) {
        const userAccess = await getUserMetadata(userKey);
        if (userAccess === null) {
          dispatch(_logout({ userKey }));
        } else {
          dispatch(_setUserAccess(userAccess));
        }
      }
    }
    void getPrivateAccess();
  }, [dispatch, userKey]);

  return (
    <div className="flex flex-col">
      <ProgressBar
        items={STAGE_TITLES}
        currItemIndex={stage}
        onItemClick={(itemIndex) => {
          setStage(itemIndex as StageIndex);
        }}
      />
      <section className="bg-base-100 text-base-content flex-grow">
        <HomeScreen stage={stage} setStage={setStage} />
        <ToastContainer theme={isDark ? "dark" : "light"} />
      </section>
    </div>
  );
}

/** Island root: the wizard owns the store, since it is the only React on the site. */
export function Wizard(): JSX.Element {
  return (
    <StrictMode>
      <Provider store={store}>
        <WizardApp />
      </Provider>
    </StrictMode>
  );
}
