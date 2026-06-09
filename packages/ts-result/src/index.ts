import { None, type Option, Some } from "@punpun-dev/ts-option";

export class Result<T, E> {
  public isSuccess(): this is Success<T> {
    return this instanceof Success;
  }

  public isFailure(): this is Failure<E> {
    return this instanceof Failure;
  }

  static success<T>(value: T): Result<T, never> {
    return new Success(value);
  }

  static failure<E>(error: E): Result<never, E> {
    return new Failure(error);
  }

  static async handle<T>(fn: () => T | Promise<T>): Promise<Result<T, unknown>> {
    try {
      return new Success(await fn());
    } catch (error) {
      return new Failure(error);
    }
  }

  static fromNullable<T, E>(value: T | null | undefined, error: E): Result<T, E> {
    if (value === null || value === undefined) return new Failure(error);
    return new Success(value);
  }

  static fromOption<T, E>(option: Option<T>, error: E): Result<T, E> {
    if (option.isSome()) return new Success(option.value);
    return new Failure(error);
  }

  static all<T, E>(results: Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];

    for (const result of results) {
      if (result.isSuccess()) values.push(result.value);
      else return result as unknown as Result<T[], E>;
    }

    return new Success(values);
  }

  public mapValue<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isSuccess()) return new Success(fn(this.value));
    return this as unknown as Result<U, E>;
  }

  public flatMapValue<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isSuccess()) return fn(this.value);
    return this as unknown as Result<U, E>;
  }

  public tapValue(fn: (value: T) => void): Result<T, E> {
    if (this.isSuccess()) fn(this.value);
    return this;
  }

  public mapError<F>(fn: (error: E) => F): Result<T, F> {
    if (this.isFailure()) return new Failure(fn(this.error));
    return this as unknown as Result<T, F>;
  }

  public flatMapError<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
    if (this.isFailure()) return fn(this.error);
    return this as unknown as Result<T, F>;
  }

  public tapError(fn: (error: E) => void): Result<T, E> {
    if (this.isFailure()) fn(this.error);
    return this;
  }

  public match<U, V>(cases: { success: (value: T) => U; failure: (error: E) => V }): U | V {
    if (this.isSuccess()) return cases.success(this.value);
    return cases.failure((this as unknown as Failure<E>).error);
  }

  public unwrapOrThrow(): T {
    if (this.isSuccess()) return this.value;
    throw new Error("Tried to unwrap a Failure value");
  }

  public unwrapOr(fallback: T): T {
    if (this.isSuccess()) return this.value;
    return fallback;
  }

  public unwrapOrElse(fallbackFn: () => T): T {
    if (this.isSuccess()) return this.value;
    return fallbackFn();
  }

  public toOption(): Option<T> {
    if (this.isSuccess()) return new Some(this.value);
    return new None();
  }

  public toNullable(): T | null {
    if (this.isSuccess()) return this.value;
    return null;
  }
}

export class Success<T> extends Result<T, never> {
  constructor(public readonly value: T) {
    super();
  }
}

export class Failure<E> extends Result<never, E> {
  constructor(public readonly error: E) {
    super();
  }
}
