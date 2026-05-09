import { AppEvent } from "./app-event";

export class PlayerCharacterFilterChangedEvent extends AppEvent {
    private readonly _search: string;
    private readonly _characterClass: string;

    public get search(): string {
        return this._search;
    }

    public get characterClass(): string {
        return this._characterClass;
    }

    constructor(search: string, characterClass: string) {
        super(PlayerCharacterFilterChangedEvent.name);
        this._search = search;
        this._characterClass = characterClass;
    }
}
