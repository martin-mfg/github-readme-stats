export function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function classnames(...args) {
  return args.join(' ');
}

export const CardTypes = {
  STATS: 'stats',
  TOP_LANGS: 'top-langs',
  PIN: 'pin',
  GIST: 'gist',
  WAKATIME: 'wakatime',
};
