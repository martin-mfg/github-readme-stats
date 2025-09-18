import { default as api } from "./api-renamed/index.js";
import { default as gist } from "./api-renamed/gist.js";
import { default as pin } from "./api-renamed/pin.js";
import { default as topLangs } from "./api-renamed/top-langs.js";
import { default as wakatime } from "./api-renamed/wakatime.js";
import { default as repeatRecent } from "./api-renamed/repeat-recent.js";
import { default as patInfo } from "./api-renamed/status/pat-info.js";
import { default as statusUp } from "./api-renamed/status/up.js";
import { default as authenticate } from "./api-renamed/authenticate.js";
import { default as deleteUser } from "./api-renamed/delete-user.js";
import { default as privateAccess } from "./api-renamed/private-access.js";
import { default as downgrade } from "./api-renamed/downgrade.js";

export default async (req, res) => {
  // remaining code expects express.js-like request and response objects
  res.send = function (data) {
    if (typeof data === "object") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    } else if (typeof data === "string") {
      res.end(data);
    } else {
      res.end(String(data));
    }
  };
  const url = new URL(req.url, "https://localhost");
  req.query = Object.fromEntries(url.searchParams.entries());

  switch (url.pathname) {
    case "/api":
      api(req, res);
      break;
    case "/api/gist":
      gist(req, res);
      break;
    case "/api/pin":
      pin(req, res);
      break;
    case "/api/top-langs":
      topLangs(req, res);
      break;
    case "/api/wakatime":
      wakatime(req, res);
      break;
    case "/api/repeat-recent":
      repeatRecent(req, res);
      break;
    case "/api/status/pat-info":
      patInfo(req, res);
      break;
    case "/api/status/up":
      statusUp(req, res);
      break;
    case "/api/authenticate":
      authenticate(req, res);
      break;
    case "/api/delete-user":
      deleteUser(req, res);
      break;
    case "/api/private-access":
      privateAccess(req, res);
      break;
    case "/api/downgrade":
      downgrade(req, res);
      break;
    default:
      res.statusCode = 404;
      res.end("Not Found");
      break;
  }
};
