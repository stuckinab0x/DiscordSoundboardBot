export function pickRandom<T>(collection: ArrayLike<T>): T {
  return collection[Math.floor(Math.random() * collection.length)];
}
