// Safe browser stub for dotenv
export function config() {
  window.process = {
    env: {
      PAT_1: 'myDummyPAT',
    }
  };
  console.log("env var has been set");
  return { parsed: {} };
}
