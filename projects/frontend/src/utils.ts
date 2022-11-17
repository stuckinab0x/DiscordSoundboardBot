export default function debounce(func: Function, wait: number, immediate = false) {
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
