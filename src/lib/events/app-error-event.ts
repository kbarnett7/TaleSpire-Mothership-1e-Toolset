import { AppEvent } from "./app-event";

export class AppErrorEvent extends AppEvent {
    private readonly _error: string;
    private readonly _details: string[];

    public get error(): string {
        return this._error;
    }

    public get details(): string[] {
        return [...this._details];
    }

    constructor(type: string, error: string, details?: string[]) {
        super(type);

        if (error.trim() === "") {
            this._error = "UNKNOWN ERROR";
        } else {
            this._error = error;
        }

        this._details = details ?? [];
    }
}
