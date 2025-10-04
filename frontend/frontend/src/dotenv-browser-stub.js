// Safe browser stub for dotenv
export function config() {
  console.warn('dotenv.config() is a no-op in the browser.');
  return { parsed: {} };
}
