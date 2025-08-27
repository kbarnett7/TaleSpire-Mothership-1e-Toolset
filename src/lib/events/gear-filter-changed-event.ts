import { AppEvent } from "./app-event";

export class GearFilterChangedEvent extends AppEvent {
    private readonly _category: string;
    private readonly _search: string;
    private readonly _sourceId: number;

    public get category(): string {
        return this._category;
    }

    public get search(): string {
        return this._search;
    }

    public get sourceId(): number {
        return this._sourceId;
    }

    constructor(category: string, search: string, sourceId: number) {
        super(GearFilterChangedEvent.name);
        this._category = category;
        this._search = search;
        this._sourceId = sourceId;
    }
}
