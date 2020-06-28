export function stringifyForNext<T>(objectToStringify: T): T {
  return JSON.parse(JSON.stringify(objectToStringify));
}
