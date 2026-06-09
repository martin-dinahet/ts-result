# ts-result

A tiny TypeScript `Result` type for explicit success and failure values.

## Installation

```bash
npm install @punpun-dev/ts-result
# or
pnpm add @punpun-dev/ts-result
# or
yarn add @punpun-dev/ts-result
```

## Usage

```typescript
import { Result } from "@punpun-dev/ts-result";

type AppError =
  | { kind: "not_found"; resource: string }
  | { kind: "validation"; message: string };

function findUser(id: string): Result<User, AppError> {
  const user = db.users.find(id);

  if (!user) {
    return Result.failure({ kind: "not_found", resource: "user" });
  }

  return Result.success(user);
}

const userName = findUser("42")
  .mapValue((user) => user.name)
  .unwrapOr("Anonymous");
```

## Option Interop

`@punpun-dev/ts-result` depends on `@punpun-dev/ts-option` for `fromOption()` and `toOption()`.

```typescript
import { Option } from "@punpun-dev/ts-option";
import { Result } from "@punpun-dev/ts-result";

const maybeUser = Option.fromNullable(cache.get("user:42"));
const userResult = Result.fromOption(maybeUser, "Missing cached user");
const backToOption = userResult.toOption();
```

## API

### Static Methods

| Method | Description |
| --- | --- |
| `Result.success<T>(value: T): Result<T, never>` | Create a successful result |
| `Result.failure<E>(error: E): Result<never, E>` | Create a failed result |
| `Result.handle<T>(fn: () => T \| Promise<T>): Promise<Result<T, unknown>>` | Capture thrown or rejected errors |
| `Result.fromNullable<T, E>(value, error): Result<T, E>` | Convert `null` or `undefined` into a failure |
| `Result.fromOption<T, E>(option, error): Result<T, E>` | Convert an `Option` into a `Result` |
| `Result.all<T, E>(results): Result<T[], E>` | Combine many results, returning the first failure |

### Instance Methods

| Method | Description |
| --- | --- |
| `isSuccess(): this is Success<T>` | Narrow to `Success` |
| `isFailure(): this is Failure<E>` | Narrow to `Failure` |
| `mapValue<U>(fn): Result<U, E>` | Transform the success value |
| `flatMapValue<U>(fn): Result<U, E>` | Chain a result-returning function |
| `tapValue(fn): Result<T, E>` | Run a side effect for `Success` |
| `mapError<F>(fn): Result<T, F>` | Transform the failure error |
| `flatMapError<F>(fn): Result<T, F>` | Recover or remap with a result-returning function |
| `tapError(fn): Result<T, E>` | Run a side effect for `Failure` |
| `match<U>(cases): U` | Handle both success and failure branches |
| `unwrapOrThrow(): T` | Return the value or throw if failed |
| `unwrapOr(fallback: T): T` | Return the value or fallback |
| `unwrapOrElse(fallbackFn: () => T): T` | Return the value or computed fallback |
| `toOption(): Option<T>` | Convert success to `Some` and failure to `None` |
| `toNullable(): T \| null` | Convert success to value and failure to `null` |

## Success and Failure

`Success<T>` and `Failure<E>` are the concrete result classes. Most code should create them through `Result.success()` and `Result.failure()`.

- `Success<T>` exposes `value: T`
- `Failure<E>` exposes `error: E`

## License

MIT
