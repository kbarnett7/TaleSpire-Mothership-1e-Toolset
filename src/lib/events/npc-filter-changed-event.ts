import { AppEvent } from "./app-event";

export class NpcFilterChangedEvent extends AppEvent {
    private readonly _search: string;

    public get search(): string {
        return this._search;
    }

    constructor(search: string) {
        super(NpcFilterChangedEvent.name);
        this._search = search;
    }
}
