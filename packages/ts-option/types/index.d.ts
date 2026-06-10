/**
 * Represents a value that may or may not exist.
 *
 * Use `Option<T>` when a missing value is expected and should be handled
 * directly instead of being passed around as `null` or `undefined`.
 *
 * @typeParam T - The type of the value when the option is `Some`.
 *
 * @example
 * ```ts
 * import { Option } from "@punpun-dev/ts-option";
 *
 * const params = new URLSearchParams(window.location.search);
 * const maybeRedirect = Option.fromNullable(params.get("redirect"));
 *
 * const redirectUrl = maybeRedirect.match({
 *   some: (url) => url,
 *   none: () => "/dashboard",
 * });
 * ```
 */
export declare class Option<T> {
  /**
   * Checks whether this option contains a value.
   *
   * Returns `true` for `Some` and narrows the type so `value` can be read.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const maybeToken = Option.fromNullable(localStorage.getItem("auth-token"));
   *
   * if (maybeToken.isSome()) {
   *   fetch("/api/me", {
   *     headers: { Authorization: `Bearer ${maybeToken.value}` },
   *   });
   * }
   * ```
   */
  isSome(): this is Some<T>;

  /**
   * Checks whether this option is empty.
   *
   * Returns `true` for `None` and narrows the type to the empty option.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const selectedFile = Option.fromNullable(fileInput.files?.item(0));
   *
   * if (selectedFile.isNone()) {
   *   formErrors.push("Please choose a file before uploading.");
   * }
   * ```
   */
  isNone(): this is None;

  /**
   * Creates an option that contains a value.
   *
   * Use this when you already know the value exists.
   *
   * @typeParam T - The value type.
   * @param value - The value to store.
   * @returns An option containing `value`.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const currentUser = Option.some({
   *   id: "user_123",
   *   name: "Ari",
   * });
   * ```
   */
  static some<T>(value: T): Option<T>;

  /**
   * Creates an empty option.
   *
   * Use this when a value is intentionally missing.
   *
   * @typeParam T - The value type that would be present in a `Some`.
   * @returns An empty option.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const cachedProfile = Option.none<{ id: string; name: string }>();
   * ```
   */
  static none<T>(): Option<T>;

  /**
   * Converts a nullable value into an option.
   *
   * Returns `None` for `null` or `undefined`. Returns `Some` for every other
   * value, including empty strings, `0`, and `false`.
   *
   * @typeParam T - The non-null value type.
   * @param value - The value to convert.
   * @returns `Some<T>` when `value` exists, otherwise `None`.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const theme = Option.fromNullable(localStorage.getItem("theme"));
   *
   * const className = theme.match({
   *   some: (name) => `theme-${name}`,
   *   none: () => "theme-system",
   * });
   * ```
   */
  static fromNullable<T>(value: T | null | undefined): Option<T>;

  /**
   * Transforms the value inside `Some`.
   *
   * If this option is `None`, the function is not called and `None` is returned.
   *
   * @typeParam U - The transformed value type.
   * @param fn - Function that receives the value from `Some`.
   * @returns A new option with the transformed value, or `None`.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const displayName = Option.fromNullable(user.profile?.name)
   *   .mapValue((name) => name.trim())
   *   .mapValue((name) => name.toUpperCase());
   * ```
   */
  mapValue<U>(fn: (value: T) => U): Option<U>;

  /**
   * Chains another option-returning operation.
   *
   * Use this when the next step can also return `None`. If this option is
   * already `None`, the function is not called.
   *
   * @typeParam U - The next value type.
   * @param fn - Function that receives the value and returns another option.
   * @returns The option returned by `fn`, or `None`.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const firstTodoTitle = Option.fromNullable(document.querySelector("[data-todo-id]"))
   *   .flatMapValue((element) => Option.fromNullable(element.getAttribute("data-todo-id")))
   *   .flatMapValue((id) => Option.fromNullable(todoCache.get(id)))
   *   .mapValue((todo) => todo.title);
   * ```
   */
  flatMapValue<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Runs a side effect when this option is `Some`.
   *
   * The original option is returned unchanged. Use this for logging, metrics,
   * or UI side effects that should only happen when a value exists.
   *
   * @param fn - Function to run with the value from `Some`.
   * @returns This same option.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const maybeCampaign = Option.fromNullable(params.get("utm_campaign"))
   *   .tapValue((campaign) => analytics.track("Campaign opened", { campaign }));
   * ```
   */
  tapValue(fn: (value: T) => void): Option<T>;

  /**
   * Handles both option states and returns one value.
   *
   * Use `match` when the code needs a final value and both the `Some` and
   * `None` branches should be clear.
   *
   * @typeParam U - The return type for both branches.
   * @param cases - Handlers for the `some` and `none` cases.
   * @returns The value returned by the matching handler.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const avatarLabel = Option.fromNullable(user.avatarUrl).match({
   *   some: () => "Change profile photo",
   *   none: () => "Add profile photo",
   * });
   * ```
   */
  match<U>(cases: { some: (value: T) => U; none: () => U }): U;

  /**
   * Converts this option back to a nullable value.
   *
   * Returns the value for `Some` and `null` for `None`.
   *
   * @returns The contained value, or `null`.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const selectedId = Option.fromNullable(selectedRow?.id).toNullable();
   *
   * await fetch("/api/selection", {
   *   method: "POST",
   *   body: JSON.stringify({ selectedId }),
   * });
   * ```
   */
  toNullable(): T | null;
}

/**
 * The concrete option state that contains a value.
 *
 * Most code should create this through `Option.some(value)` instead of calling
 * the constructor directly.
 *
 * @typeParam T - The contained value type.
 *
 * @example
 * ```ts
 * import { Some } from "@punpun-dev/ts-option";
 *
 * const loadedUser = new Some({ id: "user_123", name: "Ari" });
 * ```
 */
export declare class Some<T> extends Option<T> {
  /**
   * Creates a `Some` with a value.
   *
   * @param value - The value to store.
   *
   * @example
   * ```ts
   * import { Some } from "@punpun-dev/ts-option";
   *
   * const selectedTab = new Some("settings");
   * ```
   */
  constructor(value: T);

  /**
   * The value stored in this option.
   *
   * This property is available after `isSome()` narrows an `Option<T>` to
   * `Some<T>`.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   *
   * const maybeEmail = Option.fromNullable(form.email.value);
   *
   * if (maybeEmail.isSome()) {
   *   console.log(`Sending receipt to ${maybeEmail.value}`);
   * }
   * ```
   */
  readonly value: T;
}

/**
 * The concrete option state that does not contain a value.
 *
 * Most code should create this through `Option.none()` instead of calling the
 * constructor directly.
 *
 * @example
 * ```ts
 * import { None } from "@punpun-dev/ts-option";
 *
 * const activeModal = new None();
 * ```
 */
export declare class None extends Option<never> {
  /**
   * Creates an empty option.
   *
   * @example
   * ```ts
   * import { None } from "@punpun-dev/ts-option";
   *
   * const pendingUpload = new None();
   * ```
   */
  constructor();
}
