# ts-option

A tiny TypeScript `Option` type for explicit nullable and optional values.

## Installation

```bash
npm install @punpun-dev/ts-option
# or
pnpm add @punpun-dev/ts-option
# or
yarn add @punpun-dev/ts-option
```

## Usage

```typescript
import { Option } from "@punpun-dev/ts-option";

const maybeName = Option.fromNullable(user.name);

const label = maybeName
  .mapValue((name) => name.trim())
  .match({
    some: (name) => name,
    none: () => "Anonymous",
  });
```

## API

### Static Methods

| Method | Description |
| --- | --- |
| `Option.some<T>(value: T): Option<T>` | Create an option with a value |
| `Option.none<T>(): Option<T>` | Create an empty option |
| `Option.fromNullable<T>(value): Option<T>` | Convert `null` or `undefined` into `None` |

### Instance Methods

| Method | Description |
| --- | --- |
| `isSome(): this is Some<T>` | Narrow to `Some` |
| `isNone(): this is None` | Narrow to `None` |
| `mapValue<U>(fn): Option<U>` | Transform the contained value |
| `flatMapValue<U>(fn): Option<U>` | Chain an option-returning function |
| `tapValue(fn): Option<T>` | Run a side effect for `Some` |
| `match<U>(cases): U` | Handle both some and none branches |
| `toNullable(): T \| null` | Convert `Some` to value and `None` to `null` |

## Some and None

`Some<T>` and `None` are the concrete option classes. Most code should create them through `Option.some()` and `Option.none()`.

- `Some<T>` exposes `value: T`
- `None` represents absence

## License

MIT
