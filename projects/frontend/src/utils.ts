export function debounce(func: Function, wait: number, immediate = false) {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(this: any, ...args: any[]) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout)
      clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

export function getSeasonalThemeName() {
  const date = new Date().toString();
  if (date.includes('Jul 04'))
    return 'America';
  if (date.includes('Oct'))
    return 'Halloween';
  if (date.includes('Dec'))
    return 'Christmas';
  return 'Classic';
}

export function pickRandom<T>(collection: T[]): T {
  return collection[Math.floor(Math.random() * collection.length)];
}
