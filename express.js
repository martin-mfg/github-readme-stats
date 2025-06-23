import "dotenv/config";
import statsCard from "./.vercel/output/functions/api.func/core-app/api/index.js";
import repoCard from "./.vercel/output/functions/api.func/core-app/api/pin.js";
import langCard from "./.vercel/output/functions/api.func/core-app/api/top-langs.js";
import wakatimeCard from "./.vercel/output/functions/api.func/core-app/api/wakatime.js";
import gistCard from "./.vercel/output/functions/api.func/core-app/api/gist.js";
import express from "express";

const app = express();
app.listen(process.env.port || 9000);

app.get("/", statsCard);
app.get("/pin", repoCard);
app.get("/top-langs", langCard);
app.get("/wakatime", wakatimeCard);
app.get("/gist", gistCard);
