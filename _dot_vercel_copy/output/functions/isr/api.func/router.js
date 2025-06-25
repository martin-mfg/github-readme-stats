import { default as api } from "./api-copy/index.js";
import { default as gist } from "./api-copy/gist.js";
import { default as pin } from "./api-copy/pin.js";
import { default as topLangs } from "./api-copy/top-langs.js";
import { default as wakatime } from "./api-copy/wakatime.js";
import { default as repeatRecent } from "./api-copy/repeat-recent.js";
import { default as patInfo } from "./api-copy/status/pat-info.js";
import { default as statusUp } from "./api-copy/status/up.js";

export default async (req, res) => {
  // remaining code expects express.js-like request and response objects
  res.send = function (data) {
    if (typeof data === "object") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    } else {
      res.end(data);
    }
  };
  res.status = function (code) {
    res.statusCode = code;
    return res;
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
    case "/api/pat-info":
      patInfo(req, res);
      break;
    case "/api/status/up":
      statusUp(req, res);
      break;
    default:
      res.statusCode = 404;
      res.end("Not Found");
      break;
  }
};
