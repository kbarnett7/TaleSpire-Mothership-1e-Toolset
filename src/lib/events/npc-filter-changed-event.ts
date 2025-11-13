import { AppEvent } from "./app-event";

export class NpcFilterChangedEvent extends AppEvent {
    private readonly _search: string;
    private readonly _sourceId: number;

    public get search(): string {
        return this._search;
    }

    public get sourceId(): number {
        return this._sourceId;
    }

    constructor(search: string, sourceId: number) {
        super(NpcFilterChangedEvent.name);
        this._search = search;
        this._sourceId = sourceId;
    }
}
