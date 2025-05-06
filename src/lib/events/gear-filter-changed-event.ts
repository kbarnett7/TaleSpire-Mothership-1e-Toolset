import { AppEvent } from "./app-event";

export class GearFilterChangedEvent extends AppEvent {
    private readonly _category: string;
    private readonly _search: string;

    public get category(): string {
        return this._category;
    }

    public get search(): string {
        return this._search;
    }

    constructor(category: string, search: string) {
        super(GearFilterChangedEvent.name);
        this._category = category;
        this._search = search;
    }
}
