export default class ConcurrenceLimiter<T> {
  readonly pool: (Promise<void> | null)[];
  readonly concurrency: number;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
    this.pool = Array(concurrency).fill(null);
  }

  run(getPromise: () => Promise<T>): Promise<T> {
    const inner = (resolve: (value: T | PromiseLike<T>) => void) => {
      const index = this.pool.indexOf(null);
      if (index === -1) {
        Promise.race(this.pool).then(() => inner(resolve));
      } else {
        this.pool[index] = getPromise().then((data) => {
          this.pool[index] = null;
          resolve(data);
        });
      }
    }
    return new Promise(inner);
  }
}
