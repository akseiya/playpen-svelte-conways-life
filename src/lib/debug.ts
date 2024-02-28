/* eslint-disable @typescript-eslint/no-explicit-any */
export const jdmp = (wat: unknown) => JSON.stringify(wat, null, 4);
export const jcon = (wat: unknown) => {
  console.log(jdmp(wat));
  return wat;
};
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const recurse_object = (
  obj:any,
  action:((value:any, path:string[])=>void),
  path:string[] = []) => {
  for (const prop in obj) {
    const d_path = [...path, prop];
    if (typeof(obj[prop]) === 'object')
      recurse_object(obj[prop], action, d_path);
    else
      action(obj[prop], d_path);
  }
}
