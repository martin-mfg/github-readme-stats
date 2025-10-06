// @ts-check

import { renderRepoCard } from "../src/cards/repo.js";
import { blacklist } from "../src/common/blacklist.js";
import {
  resolveCacheSeconds,
  setCacheHeaders,
  setErrorCacheHeaders,
} from "../src/common/cache.js";
import { whitelist } from "../src/common/envs.js";
import {
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "../src/common/utils.js";
import { fetchRepo } from "../src/fetchers/repo.js";
import { isLocaleAvailable } from "../src/translations.js";
import { storeRequest } from "../src/common/database.js";

export default async (req, res) => {
  const {
    username,
    repo,
    hide_border,
    title_color,
    icon_color,
    text_color,
    bg_color,
    card_width,
    theme,
    show_owner,
    show,
    show_icons,
    number_format,
    text_bold,
    line_height,
    cache_seconds,
    locale,
    border_radius,
    border_color,
    description_lines_count,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  if (whitelist && !whitelist.includes(username)) {
    return res.send(
      renderError(
        "This username is not whitelisted",
        "Please deploy your own instance",
        {
          title_color,
          text_color,
          bg_color,
          border_color,
          theme,
          show_repo_link: false,
        },
      ),
    );
  }

  if (whitelist === undefined && blacklist.includes(username)) {
    return res.send(
      renderError(
        "This username is blacklisted",
        "Please deploy your own instance",
        {
          title_color,
          text_color,
          bg_color,
          border_color,
          theme,
          show_repo_link: false,
        },
      ),
    );
  }

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(
      renderError("Something went wrong", "Language not found", {
        title_color,
        text_color,
        bg_color,
        border_color,
        theme,
      }),
    );
  }

  const safePattern = /^[-\w\/.,]+$/;
  if (
    (username && !safePattern.test(username)) ||
    (repo && !safePattern.test(repo))
  ) {
    return res.send(
      renderError(
        "Something went wrong",
        "Username or repository contains unsafe characters",
        {
          title_color,
          text_color,
          bg_color,
          border_color,
          theme,
        },
      ),
    );
  }

  try {
    await storeRequest(req);
    const showStats = parseArray(show);
    const repoData = await fetchRepo(
      username,
      repo,
      showStats.includes("prs_authored"),
      showStats.includes("prs_commented"),
      showStats.includes("prs_reviewed"),
      showStats.includes("issues_authored"),
      showStats.includes("issues_commented"),
    );
    const repoData = await fetchRepo(username, repo);

    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CONSTANTS.PIN_CARD_CACHE_SECONDS,
      min: CONSTANTS.FOUR_HOURS,
      max: CONSTANTS.TEN_DAY,
    });

    setCacheHeaders(res, cacheSeconds);

    return res.send(
      renderRepoCard(repoData, {
        hide_border: parseBoolean(hide_border),
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
        border_radius,
        border_color,
        card_width_input: parseInt(card_width, 10),
        show_owner: parseBoolean(show_owner),
        show: showStats,
        show_icons: parseBoolean(show_icons),
        number_format,
        text_bold: parseBoolean(text_bold),
        line_height,
        username,
        locale: locale ? locale.toLowerCase() : null,
        description_lines_count,
      }),
    );
  } catch (err) {
    setErrorCacheHeaders(res);
    return res.send(
      renderError(err.message, err.secondaryMessage, {
        title_color,
        text_color,
        bg_color,
        border_color,
        theme,
      }),
    );
  }
};
