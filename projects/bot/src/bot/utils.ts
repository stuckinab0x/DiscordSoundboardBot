// eslint-disable-next-line import/prefer-default-export
export function pickRandom<T>(collection: T[]): T {
  return collection[Math.floor(Math.random() * collection.length)];
}
