import { default as gist } from "./api/gist.js";
import { default as pin } from "./api/pin.js";
import axios from "axios";

export default async (req, res) => {
  console.log(axios);
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
