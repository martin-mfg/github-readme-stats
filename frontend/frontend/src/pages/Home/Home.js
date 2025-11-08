import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BounceLoader from 'react-spinners/BounceLoader';

import { v4 as uuidv4 } from 'uuid';
import { ProgressBar } from '../../components';
import {
  CustomizeStage,
  DisplayStage,
  SelectCardStage,
  ThemeStage,
} from './stages';

import { authenticate } from '../../api';
import { login as _login } from '../../redux/actions/userActions';
import { HOST } from '../../constants';
import { CardTypes } from '../../utils';
import { DEFAULT_OPTION as STATS_DEFAULT_LAYOUT } from '../../components/Home/StatsLayoutSection';
import { DEFAULT_OPTION as LANGUAGES_DEFAULT_LAYOUT } from '../../components/Home/LanguagesLayoutSection';
import { DEFAULT_OPTION as WAKATIME_DEFAULT_LAYOUT } from '../../components/Home/WakatimeLayoutSection';

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const userId = useSelector((state) => state.user.userId);
  const privateAccess = useSelector((state) => state.user.privateAccess);

  const isAuthenticated = userId && userId.length > 0;

  const dispatch = useDispatch();

  const login = (newUserId, userKey) => dispatch(_login(newUserId, userKey));

  // for all stages
  const [stage, setStage] = useState(0);

  // for stage one
  const [selectedCard, setSelectedCard] = useState('stats');
  const [imageSrc, setImageSrc] = useState(`?&username=${userId}`);

  // for stage two
  const [selectedStatsLayout, setSelectedStatsLayout] =
    useState(STATS_DEFAULT_LAYOUT);
  const [selectedLanguagesLayout, setSelectedLanguagesLayout] = useState(
    LANGUAGES_DEFAULT_LAYOUT,
  );
  const [selectedWakatimeLayout, setSelectedWakatimeLayout] = useState(
    WAKATIME_DEFAULT_LAYOUT,
  );

  const [showTitle, setShowTitle] = useState(true);
  const [showOwner, setShowOwner] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState();
  const [customTitle, setCustomTitle] = useState('');
  const [langsCount, setLangsCount] = useState();
  const [showIcons, setShowIcons] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [usePercent, setUsePercent] = useState(false);

  const resetCustomization = () => {
    // setUsePercent(false);
    if (selectedCard === CardTypes.TOP_LANGS) {
      setSelectedWakatimeLayout(WAKATIME_DEFAULT_LAYOUT);
    }
    if (selectedCard === CardTypes.WAKATIME) {
      setSelectedLanguagesLayout(LANGUAGES_DEFAULT_LAYOUT);
    }
    if (theme === 'default' || theme === 'default_repocard') {
      if (selectedCard === CardTypes.PIN || selectedCard === CardTypes.GIST) {
        setTheme('default_repocard');
      } else {
        setTheme('default');
      }
    }
  };

  useEffect(() => {
    resetCustomization();
  }, [selectedCard]);

  useEffect(() => {
    setImageSrc(`?&username=${userId}`);
  }, [userId]);

  let fullSuffix = `${imageSrc}`;

  if (selectedStatsLayout !== STATS_DEFAULT_LAYOUT) {
    fullSuffix += `&rank_icon=${selectedStatsLayout.value}`;
  }

  if (selectedLanguagesLayout !== LANGUAGES_DEFAULT_LAYOUT) {
    fullSuffix += `&layout=${selectedLanguagesLayout.value}`;
  }

  if (selectedWakatimeLayout !== WAKATIME_DEFAULT_LAYOUT) {
    fullSuffix += `&layout=${selectedWakatimeLayout.value}`;
  }

  if (!showTitle) {
    fullSuffix += '&hide_title=true';
  }

  if (showOwner) {
    fullSuffix += '&show_owner=true';
  }

  if (descriptionLines) {
    fullSuffix += `&description_lines_count=${descriptionLines}`;
  }

  if (customTitle) {
    const encodedTitle = encodeURIComponent(customTitle);
    fullSuffix += `&custom_title=${encodedTitle}`;
  }

  if (langsCount) {
    fullSuffix += `&langs_count=${langsCount}`;
  }

  if (showIcons) {
    fullSuffix += `&show_icons=true`;
  }

  if (!enableAnimations) {
    fullSuffix += `&disable_animations=${!enableAnimations}`;
  }

  if (usePercent) {
    fullSuffix += `&display_format=percent`;
  }

  // for stage three
  const [theme, setTheme] = useState('default');
  const themeSuffix = `${fullSuffix}&theme=${theme}`;

  useEffect(() => {
    async function redirectCode() {
      // After requesting Github access, Github redirects back to your app with a code parameter
      const url = window.location.href;

      // If Github API returns the code parameter
      if (url.includes('code=')) {
        const tempPrivateAccess = url.includes('private');
        const newUrl = url.split('?code=');
        const redirect = `${url.split(HOST)[0]}${HOST}/frontend/user`;
        window.history.pushState({}, null, redirect);
        setIsLoading(true);
        const userKey = uuidv4();
        const newUserId = await authenticate(
          newUrl[1],
          tempPrivateAccess,
          userKey,
        );
        login(newUserId, userKey);
        setIsLoading(false);
      }
    }

    redirectCode();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full py-8 flex justify-center items-center">
        <BounceLoader color="#3B82F6" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full py-8 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Please sign in to access this page
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full px-2 py-4 lg:p-8 text-gray-600 body-font">
      <div className="flex flex-col">
        <ProgressBar
          items={[
            'Select Card',
            'Modify Parameters',
            'Customize Theme',
            'Display Card',
          ]}
          currItem={stage}
          setCurrItem={setStage}
        />
        <div className="m-4 rounded-sm">
          <div className="lg:p-4">
            <div className="text-2xl text-gray-600 font-semibold">
              {
                [
                  'Select a Card',
                  'Modify Card Parameters',
                  'Choose a Theme',
                  'Display your Card',
                ][stage]
              }
            </div>
            <div>
              {
                [
                  'You will be able to customize your card in future steps.',
                  'Change the date range, include private commits, and more!',
                  'Choose from one of our predefined themes (more coming soon!)',
                  'Display your card on GitHub, Twitter, or Linkedin',
                ][stage]
              }
            </div>
          </div>
          {stage === 0 && (
            <SelectCardStage
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              setImageSrc={setImageSrc}
            />
          )}
          {stage === 1 && (
            <CustomizeStage
              selectedCard={selectedCard || CardTypes.STATS}
              imageSrc={imageSrc}
              selectedStatsLayout={selectedStatsLayout}
              setSelectedStatsLayout={setSelectedStatsLayout}
              selectedLanguagesLayout={selectedLanguagesLayout}
              setSelectedLanguagesLayout={setSelectedLanguagesLayout}
              selectedWakatimeLayout={selectedWakatimeLayout}
              setSelectedWakatimeLayout={setSelectedWakatimeLayout}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              showOwner={showOwner}
              setShowOwner={setShowOwner}
              descriptionLines={descriptionLines}
              setDescriptionLines={setDescriptionLines}
              customTitle={customTitle}
              setCustomTitle={setCustomTitle}
              langsCount={langsCount}
              setLangsCount={setLangsCount}
              showIcons={showIcons}
              setShowIcons={setShowIcons}
              enableAnimations={enableAnimations}
              setEnableAnimations={setEnableAnimations}
              usePercent={usePercent}
              setUsePercent={setUsePercent}
              fullSuffix={fullSuffix}
            />
          )}
          {stage === 2 && (
            <ThemeStage
              theme={theme}
              setTheme={setTheme}
              fullSuffix={fullSuffix}
            />
          )}
          {stage === 3 && (
            <DisplayStage userId={userId} themeSuffix={themeSuffix} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
