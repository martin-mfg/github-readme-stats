import { default as gist } from "./api/gist.js";
import { default as pin } from "./api/pin.js";

export default async (req, res) => {
  const url = new URL(req.url, "https://localhost");
  req.query = Object.fromEntries(url.searchParams.entries());

  console.log(
    req.query +
      " # " +
      req.method +
      " # " +
      req.headers +
      " # " +
      res.setHeader +
      " # " +
      res.send +
      " # " +
      res.status,
  );

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
