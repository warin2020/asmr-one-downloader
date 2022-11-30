class Queue<T> {
  private data: Array<T>;

  constructor(_data?: Array<T>) {
    this.data = _data ?? [];
  }

  push(val: T) {
    this.data.push(val);
  }

  shift(): T | undefined {
    return this.data.shift();
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }
}

interface Task<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  fn: () => Promise<T>;
}

export default class ConcurrenceLimiter<T> {
  private concurrency: number;
  private count = 0;
  private queue = new Queue<Task<T>>();

  constructor(_concurrency: number) {
    this.concurrency = _concurrency;
  }

  add(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
      const task: Task<T> = { resolve, fn };
      if (this.count < this.concurrency) {
        this.count++;
        this.run(task);
      } else {
        this.queue.push(task);
      }
    });
  }

  private run(task: Task<T>) {
    task.fn().then((value) => {
      task.resolve(value);
      if (!this.queue.isEmpty()) {
        this.run(this.queue.shift()!);
      } else {
        this.count--;
      }
    });
  }
}
