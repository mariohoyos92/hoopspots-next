export function stringifyForNext(objectToStringify: any) {
  return JSON.parse(JSON.stringify(objectToStringify));
}
