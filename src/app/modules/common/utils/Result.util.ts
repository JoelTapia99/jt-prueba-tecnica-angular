export class Result<T, E> {
  private constructor(
    private readonly value?: T,
    private readonly error?: E,
  ) {}

  static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined);
  }

  static error<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error);
  }

  static empty<T, E>(): Result<T, E> {
    return new Result<T, E>(undefined, undefined);
  }

  isEmpty(): boolean {
    return this.value === undefined && this.error === undefined;
  }

  isOk(): boolean {
    return this.error === undefined;
  }

  isError(): boolean {
    return this.error !== undefined;
  }

  getValue(): T {
    if (!this.isOk()) {
      throw new Error('Cannot get value from error result');
    }
    return this.value!;
  }

  getError(): E {
    if (!this.isError()) {
      throw new Error('Cannot get error from success result');
    }
    return this.error!;
  }

  ifIsOk(fn: (value: T) => void): Result<T, E> {
    if (this.isOk()) {
      fn(this.getValue());
    }
    return this;
  }

  ifIsError(fn: (error: E) => void): Result<T, E> {
    if (this.isError()) {
      fn(this.getError());
    }
    return this;
  }

  ifIsOkOrElse(okFn: (value: T) => void, errorFn: (error: E) => void): void {
    if (this.isOk()) {
      okFn(this.getValue());
    } else {
      errorFn(this.getError());
    }
  }
}
