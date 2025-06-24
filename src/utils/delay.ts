/**
 * Creates a delay for the specified number of milliseconds.
 * Must be awaited when called.
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default delay;
