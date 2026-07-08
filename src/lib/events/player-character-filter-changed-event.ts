import { AppEvent } from "./app-event";

export class PlayerCharacterFilterChangedEvent extends AppEvent {
    private readonly _search: string;
    private readonly _characterClassId: number;

    public get search(): string {
        return this._search;
    }

    public get characterClassId(): number {
        return this._characterClassId;
    }

    constructor(search: string, characterClassId: number) {
        super(PlayerCharacterFilterChangedEvent.name);
        this._search = search;
        this._characterClassId = characterClassId;
    }
}
