# ts-result packages

This repository now publishes two small TypeScript packages:

- [`@punpun-dev/ts-result`](https://www.npmjs.com/package/@punpun-dev/ts-result): explicit success and failure values
- [`@punpun-dev/ts-option`](https://www.npmjs.com/package/@punpun-dev/ts-option): explicit present and absent values

## Packages

### `@punpun-dev/ts-result`

```bash
pnpm add @punpun-dev/ts-result
```

```typescript
import { Result } from "@punpun-dev/ts-result";

const user = Result.fromNullable(db.users.find("42"), "User not found")
  .mapValue((user) => user.name)
  .unwrapOr("Anonymous");
```

### `@punpun-dev/ts-option`

```bash
pnpm add @punpun-dev/ts-option
```

```typescript
import { Option } from "@punpun-dev/ts-option";

const label = Option.fromNullable(user.name).match({
  some: (name) => name,
  none: () => "Anonymous",
});
```

## Development

```bash
pnpm install
pnpm build
pnpm typecheck
```

Publish order matters because `@punpun-dev/ts-result` depends on `@punpun-dev/ts-option`:

```bash
pnpm publish:option
pnpm publish:result
```

## License

MIT
