import { type Option } from "@punpun-dev/ts-option";

/**
 * Represents an operation that can either succeed with a value or fail with an
 * error.
 *
 * Use `Result<T, E>` when failure is expected and callers should handle it
 * directly instead of relying on thrown errors.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The failure error type.
 *
 * @example
 * ```ts
 * import { Result } from "@punpun-dev/ts-result";
 *
 * type Profile = { id: string; name: string };
 * type ApiError = { status: number; message: string };
 *
 * async function loadProfile(id: string): Promise<Result<Profile, ApiError>> {
 *   const response = await fetch(`/api/profiles/${id}`);
 *
 *   if (!response.ok) {
 *     return Result.failure({
 *       status: response.status,
 *       message: "Could not load profile.",
 *     });
 *   }
 *
 *   return Result.success(await response.json());
 * }
 * ```
 */
export declare class Result<T, E> {
  /**
   * Checks whether this result is a success.
   *
   * Returns `true` for `Success` and narrows the type so `value` can be read.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const user = Result.success({ id: "user_123", name: "Ari" });
   *
   * if (user.isSuccess()) {
   *   document.title = `Profile: ${user.value.name}`;
   * }
   * ```
   */
  isSuccess(): this is Success<T>;

  /**
   * Checks whether this result is a failure.
   *
   * Returns `true` for `Failure` and narrows the type so `error` can be read.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const result = Result.failure({ message: "Email is required." });
   *
   * if (result.isFailure()) {
   *   showFormError(result.error.message);
   * }
   * ```
   */
  isFailure(): this is Failure<E>;

  /**
   * Creates a successful result.
   *
   * Use this when an operation completed and produced a value.
   *
   * @typeParam T - The success value type.
   * @param value - The value to store.
   * @returns A successful result containing `value`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const profile = Result.success({
   *   id: "user_123",
   *   displayName: "Ari",
   * });
   * ```
   */
  static success<T>(value: T): Result<T, never>;

  /**
   * Creates a failed result.
   *
   * Use this when an operation could not produce a value and the error should be
   * handled by the caller.
   *
   * @typeParam E - The failure error type.
   * @param error - The error to store.
   * @returns A failed result containing `error`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const invalidForm = Result.failure({
   *   field: "email",
   *   message: "Enter a valid email address.",
   * });
   * ```
   */
  static failure<E>(error: E): Result<never, E>;

  /**
   * Runs a function and captures thrown or rejected errors.
   *
   * Returns `Success` with the function result when it completes. Returns
   * `Failure` with the caught error when the function throws or the promise
   * rejects.
   *
   * @typeParam T - The value returned by the function.
   * @param fn - The function to run.
   * @returns A promise of a result.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const settings = await Result.handle(async () => {
   *   const response = await fetch("/api/settings");
   *
   *   if (!response.ok) {
   *     throw new Error("Settings request failed.");
   *   }
   *
   *   return response.json();
   * });
   * ```
   */
  static handle<T>(fn: () => T | Promise<T>): Promise<Result<T, unknown>>;

  /**
   * Converts a nullable value into a result.
   *
   * Returns `Failure` for `null` or `undefined`. Returns `Success` for every
   * other value, including empty strings, `0`, and `false`.
   *
   * @typeParam T - The non-null success value type.
   * @typeParam E - The failure error type.
   * @param value - The value to convert.
   * @param error - The error to use when `value` is missing.
   * @returns `Success<T>` when `value` exists, otherwise `Failure<E>`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const userId = Result.fromNullable(
   *   new URLSearchParams(window.location.search).get("userId"),
   *   { code: "missing_user_id", message: "The URL must include userId." },
   * );
   * ```
   */
  static fromNullable<T, E>(value: T | null | undefined, error: E): Result<T, E>;

  /**
   * Converts an option into a result.
   *
   * Returns `Success` when the option is `Some`. Returns `Failure` with the
   * provided error when the option is `None`.
   *
   * @typeParam T - The success value type.
   * @typeParam E - The failure error type.
   * @param option - The option to convert.
   * @param error - The error to use when the option is `None`.
   * @returns A result with the option value or the provided error.
   *
   * @example
   * ```ts
   * import { Option } from "@punpun-dev/ts-option";
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const maybeToken = Option.fromNullable(localStorage.getItem("auth-token"));
   * const token = Result.fromOption(maybeToken, {
   *   code: "missing_token",
   *   message: "Please sign in again.",
   * });
   * ```
   */
  static fromOption<T, E>(option: Option<T>, error: E): Result<T, E>;

  /**
   * Combines many results into one result.
   *
   * Returns `Success` with all success values when every result succeeds. Stops
   * at the first failure and returns that failure.
   *
   * @typeParam T - The success value type.
   * @typeParam E - The failure error type.
   * @param results - The results to combine.
   * @returns A result containing all values, or the first error.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const responses = Result.all([
   *   await loadJson("/api/me"),
   *   await loadJson("/api/notifications"),
   *   await loadJson("/api/preferences"),
   * ]);
   *
   * const dashboard = responses.mapValue(([me, notifications, preferences]) => ({
   *   me,
   *   notifications,
   *   preferences,
   * }));
   * ```
   */
  static all<T, E>(results: Result<T, E>[]): Result<T[], E>;

  /**
   * Transforms the success value.
   *
   * If this result is `Failure`, the function is not called and the failure is
   * returned unchanged.
   *
   * @typeParam U - The transformed success value type.
   * @param fn - Function that receives the success value.
   * @returns A result with the transformed value, or the original failure.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const title = Result.success({ title: "  New message  " })
   *   .mapValue((message) => message.title.trim());
   * ```
   */
  mapValue<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * Chains another result-returning operation from a success value.
   *
   * Use this when the next step can also fail. If this result is already
   * `Failure`, the function is not called.
   *
   * @typeParam U - The next success value type.
   * @param fn - Function that receives the success value and returns a result.
   * @returns The result returned by `fn`, or the original failure.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const saved = validateProfile(formData)
   *   .flatMapValue((profile) => saveProfile(profile))
   *   .flatMapValue((profile) => refreshProfileCache(profile.id));
   * ```
   */
  flatMapValue<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Runs a side effect when this result is `Success`.
   *
   * The original result is returned unchanged. Use this for logging, metrics,
   * cache writes, or UI effects that should only happen after success.
   *
   * @param fn - Function to run with the success value.
   * @returns This same result.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const updated = Result.success({ id: "user_123" })
   *   .tapValue((user) => analytics.track("Profile updated", { id: user.id }));
   * ```
   */
  tapValue(fn: (value: T) => void): Result<T, E>;

  /**
   * Transforms the failure error.
   *
   * If this result is `Success`, the function is not called and the success is
   * returned unchanged.
   *
   * @typeParam F - The transformed error type.
   * @param fn - Function that receives the failure error.
   * @returns A result with the transformed error, or the original success.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const displayResult = apiResult.mapError((error) => ({
   *   message: error.status === 404 ? "User not found." : "Please try again.",
   * }));
   * ```
   */
  mapError<F>(fn: (error: E) => F): Result<T, F>;

  /**
   * Chains another result-returning operation from a failure error.
   *
   * Use this to recover from an error or replace it with a different error
   * result. If this result is `Success`, the function is not called.
   *
   * @typeParam F - The next failure error type.
   * @param fn - Function that receives the error and returns a result.
   * @returns The result returned by `fn`, or the original success.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const profile = networkProfile.flatMapError((error) => {
   *   if (error.status === 503) {
   *     return loadProfileFromCache();
   *   }
   *
   *   return Result.failure({ message: "Could not load profile." });
   * });
   * ```
   */
  flatMapError<F>(fn: (error: E) => Result<T, F>): Result<T, F>;

  /**
   * Runs a side effect when this result is `Failure`.
   *
   * The original result is returned unchanged. Use this for logging, metrics,
   * or displaying error state.
   *
   * @param fn - Function to run with the failure error.
   * @returns This same result.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const profile = await loadProfile("user_123");
   *
   * profile.tapError((error) => {
   *   console.error("Profile load failed", error);
   * });
   * ```
   */
  tapError(fn: (error: E) => void): Result<T, E>;

  /**
   * Handles both result states and returns one value.
   *
   * Use `match` when the code needs a final value and both the success and
   * failure branches should be clear.
   *
   * @typeParam U - The success branch return type.
   * @typeParam V - The failure branch return type.
   * @param cases - Handlers for the `success` and `failure` cases.
   * @returns The value returned by the matching handler.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const message = saveResult.match({
   *   success: (user) => `Saved ${user.name}.`,
   *   failure: (error) => error.message,
   * });
   * ```
   */
  match<U, V>(cases: { success: (value: T) => U; failure: (error: E) => V }): U | V;

  /**
   * Returns the success value or throws an error.
   *
   * Prefer `match`, `unwrapOr`, or `unwrapOrElse` in code where failure is
   * expected. This method is best for places where failure means the program
   * cannot continue.
   *
   * @returns The success value.
   * @throws Error when this result is `Failure`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const config = Result.fromNullable(window.__APP_CONFIG__, "Missing config")
   *   .unwrapOrThrow();
   * ```
   */
  unwrapOrThrow(): T;

  /**
   * Returns the success value or a fallback value.
   *
   * The fallback value is used only when this result is `Failure`.
   *
   * @param fallback - Value to return when this result failed.
   * @returns The success value, or `fallback`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const displayName = loadCurrentUser()
   *   .mapValue((user) => user.name)
   *   .unwrapOr("Guest");
   * ```
   */
  unwrapOr(fallback: T): T;

  /**
   * Returns the success value or computes a fallback value.
   *
   * The fallback function is called only when this result is `Failure`.
   *
   * @param fallbackFn - Function that creates a fallback value.
   * @returns The success value, or the value returned by `fallbackFn`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const items = loadCartItems().unwrapOrElse(() => {
   *   return JSON.parse(localStorage.getItem("cart-backup") ?? "[]");
   * });
   * ```
   */
  unwrapOrElse(fallbackFn: () => T): T;

  /**
   * Converts this result into an option.
   *
   * Returns `Some` with the success value or `None` for a failure. The error is
   * not kept.
   *
   * @returns An option containing the success value, or `None`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const maybeProfile = (await loadProfile("user_123")).toOption();
   * ```
   */
  toOption(): Option<T>;

  /**
   * Converts this result back to a nullable value.
   *
   * Returns the value for `Success` and `null` for `Failure`. The error is not
   * kept.
   *
   * @returns The success value, or `null`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const profileOrNull = (await loadProfile("user_123")).toNullable();
   *
   * renderProfile(profileOrNull);
   * ```
   */
  toNullable(): T | null;
}

/**
 * The concrete result state for a successful operation.
 *
 * Most code should create this through `Result.success(value)` instead of
 * calling the constructor directly.
 *
 * @typeParam T - The contained success value type.
 *
 * @example
 * ```ts
 * import { Success } from "@punpun-dev/ts-result";
 *
 * const response = new Success({ status: 200, body: { ok: true } });
 * ```
 */
export declare class Success<T> extends Result<T, never> {
  /**
   * Creates a successful result with a value.
   *
   * @param value - The success value to store.
   *
   * @example
   * ```ts
   * import { Success } from "@punpun-dev/ts-result";
   *
   * const savedUser = new Success({ id: "user_123", name: "Ari" });
   * ```
   */
  constructor(value: T);

  /**
   * The value stored in this successful result.
   *
   * This property is available after `isSuccess()` narrows a `Result<T, E>` to
   * `Success<T>`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const result = Result.success({ id: "user_123", name: "Ari" });
   *
   * if (result.isSuccess()) {
   *   renderUser(result.value);
   * }
   * ```
   */
  readonly value: T;
}

/**
 * The concrete result state for a failed operation.
 *
 * Most code should create this through `Result.failure(error)` instead of
 * calling the constructor directly.
 *
 * @typeParam E - The contained failure error type.
 *
 * @example
 * ```ts
 * import { Failure } from "@punpun-dev/ts-result";
 *
 * const failedRequest = new Failure({
 *   status: 500,
 *   message: "The server could not save the profile.",
 * });
 * ```
 */
export declare class Failure<E> extends Result<never, E> {
  /**
   * Creates a failed result with an error.
   *
   * @param error - The failure error to store.
   *
   * @example
   * ```ts
   * import { Failure } from "@punpun-dev/ts-result";
   *
   * const invalidEmail = new Failure({
   *   field: "email",
   *   message: "Enter a valid email address.",
   * });
   * ```
   */
  constructor(error: E);

  /**
   * The error stored in this failed result.
   *
   * This property is available after `isFailure()` narrows a `Result<T, E>` to
   * `Failure<E>`.
   *
   * @example
   * ```ts
   * import { Result } from "@punpun-dev/ts-result";
   *
   * const result = Result.failure({ message: "Could not save profile." });
   *
   * if (result.isFailure()) {
   *   showToast(result.error.message);
   * }
   * ```
   */
  readonly error: E;
}
