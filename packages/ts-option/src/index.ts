export class Option<T> {
  public isSome(): this is Some<T> {
    return this instanceof Some;
  }

  public isNone(): this is None {
    return this instanceof None;
  }

  static some<T>(value: T): Option<T> {
    return new Some(value);
  }

  static none<T>(): Option<T> {
    return new None();
  }

  static fromNullable<T>(value: T | null | undefined): Option<T> {
    if (value === null || value === undefined) return new None();
    return new Some(value);
  }

  public mapValue<U>(fn: (value: T) => U): Option<U> {
    if (this.isSome()) return new Some(fn(this.value));
    return new None();
  }

  public flatMapValue<U>(fn: (value: T) => Option<U>): Option<U> {
    if (this.isSome()) return fn(this.value);
    return new None();
  }

  public tapValue(fn: (value: T) => void): Option<T> {
    if (this.isSome()) fn(this.value);
    return this;
  }

  public match<U>(cases: { some: (value: T) => U; none: () => U }): U {
    if (this.isSome()) return cases.some(this.value);
    return cases.none();
  }

  public toNullable(): T | null {
    if (this.isSome()) return this.value;
    return null;
  }
}

export class Some<T> extends Option<T> {
  constructor(public readonly value: T) {
    super();
  }
}

export class None extends Option<never> {
  constructor() {
    super();
  }
}
