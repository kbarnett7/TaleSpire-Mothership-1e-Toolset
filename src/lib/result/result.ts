import { ResultError } from "./result-error";

/**
 * The `Result` class is a generic utility class that encapsulates the outcome of an operation.
 * It has four main properties: `_isSuccess`, `_error`, `_value`, and the generic parameter `T`.
 *
 * `_isSuccess` is a boolean that indicates whether the operation was successful or not.
 * `_error` is an instance of `ResultError` that holds any error information if the operation failed.
 * `_value` is an optional property of type `T` that holds the result of the operation if it was successful.
 * `T` is a generic parameter that represents the type of the result value.
 *
 * The class provides getters for each of these properties (`isSuccess`, `isFailure`, `error`, `value`).
 *
 * Use the static methods `success` and `failure` to create instances of `Result`.
 *
 * SOURCE: https://www.milanjovanovic.tech/blog/functional-error-handling-in-dotnet-with-the-result-pattern#expressing-errors-using-the-result-pattern
 */
export class Result<T> {
    private _isSuccess: boolean;
    private _error: ResultError;
    private _value?: T;

    public get isSuccess(): boolean {
        return this._isSuccess;
    }

    public get isFailure(): boolean {
        return !this._isSuccess;
    }

    public get error(): ResultError {
        return this._error;
    }

    public get value(): T | undefined {
        return this._value;
    }

    private constructor(isSuccess: boolean, error: ResultError, value?: T) {
        this._isSuccess = isSuccess;
        this._error = error;
        this._value = value as T | undefined;
    }

    public static success<T>(value?: T): Result<T> {
        return new Result<T>(true, ResultError.none(), value);
    }

    public static failure<T>(error: ResultError): Result<T> {
        return new Result<T>(false, error);
    }
}
