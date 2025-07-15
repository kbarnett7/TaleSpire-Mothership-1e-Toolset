import { AppEvent } from "./app-event";

export class ShowNavigateBackButtonEvent extends AppEvent {
    private readonly _backToUrl: string;

    public get backToUrl(): string {
        return this._backToUrl;
    }

    constructor(backToUrl: string) {
        super(ShowNavigateBackButtonEvent.name);
        this._backToUrl = backToUrl;
    }
}
