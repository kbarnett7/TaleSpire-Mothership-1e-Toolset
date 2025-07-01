/**
 * The `ResultError` class is a utility class that encapsulates error information.
 * It has two main properties: `code` and `description`.
 *
 * `code` is a string that represents the error code.
 * `description` is a string that provides a human-readable description of the error.
 * `details` is a string array that provides additional context and detailed messages for the error.
 *
 * The class provides a static method `none` that returns a `ResultError` instance with empty `code` and `description`.
 * This can be used when an operation is successful and there is no error to report.
 *
 * SOURCE: https://www.milanjovanovic.tech/blog/functional-error-handling-in-dotnet-with-the-result-pattern#expressing-errors-using-the-result-pattern
 */
export class ResultError {
    private _code: string;
    private _description: string;
    private _details: string[];

    public get code(): string {
        return this._code;
    }

    public get description(): string {
        return this._description;
    }

    public get details(): string[] {
        return this.details;
    }

    constructor(code: string, description: string, details?: string[]) {
        this._code = code;
        this._description = description;
        this._details = details ?? [];
    }

    public static none(): ResultError {
        return new ResultError("", "");
    }
}
