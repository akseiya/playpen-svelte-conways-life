export const jdmp = (wat: unknown) => JSON.stringify(wat, null, 4);
export const jcon = (wat: unknown) => {
  console.log(jdmp(wat));
  return wat;
};
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
