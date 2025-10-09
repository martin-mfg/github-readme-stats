/* eslint-disable no-nested-ternary */
export const PROD = true;

export const USE_LOGGER = true;

export const CLIENT_ID = 'Ov23liZSweT9LJrck9i8';

export const MODE = 'trends';

export const HOST = PROD
  ? 'monorepo-test-backend-seven.vercel.app'
  : 'localhost:3000';

export const REDIRECT_URI = PROD
  ? MODE === 'trends'
    ? `https://${HOST}/frontend/user`
    : 'https://www.githubtrends.io/user/wrapped'
  : MODE === 'trends'
    ? `http://${HOST}/frontend/user`
    : 'http://localhost:3000/user/wrapped';

export const GITHUB_PRIVATE_AUTH_URL = `https://github.com/login/oauth/authorize?scope=user,repo&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}/private`;
export const GITHUB_PUBLIC_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}/public`;

export const WRAPPED_URL = PROD
  ? 'https://www.githubwrapped.io'
  : 'http://localhost:3001';

export const BACKEND_URL = PROD
  ? 'https://api.githubtrends.io'
  : 'http://localhost:8000';

export const CURR_YEAR = 2024;

window.process = {
  env: {
    PAT_1: 'myDummyPAT',
  },
};
