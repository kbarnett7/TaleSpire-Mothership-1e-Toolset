import { AppEvent } from "./app-event";

export class AppErrorEvent extends AppEvent {
    private readonly _error: string;

    public get error(): string {
        return this._error;
    }

    constructor(type: string, error: string) {
        super(type);

        if (error.trim() === "") {
            this._error = "UNKNOWN ERROR";
        } else {
            this._error = error;
        }
    }
}
