import { default as gist } from "./api/gist.js";
import { default as pin } from "./api/pin.js";

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
    case "/gist":
      gist(req, res);
      break;
    case "/pin":
      pin(req, res);
      break;
    default:
      res.statusCode = 404;
      res.end("Not Found");
      break;
  }
};
