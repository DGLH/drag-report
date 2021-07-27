function getObjValue<T>(obj: T, key: keyof T): T[keyof T] {
  return obj[key];
}

// eslint-disable-next-line
function pick<T extends object, U extends keyof T>(obj: T, keys: U[]): T[U][] {
  return keys.map((key) => obj[key]);
}

// type Partial<T> = {
//   [k in keyof T]?: T[k];
// };

// type Required<T> = {
//   [k in keyof T]-?: T[k];
// };

// type Readonly<T> = {
//   readonly [k in keyof T]: T[k];
// };

// const foo = (): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     resolve("linbudu");
//   });
// };

// // Promise<string>
// type FooReturnType = ReturnType<typeof foo>;

// // string
// type NakedFooReturnType = PromiseType<FooReturnType>;

// export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export { getObjValue };
