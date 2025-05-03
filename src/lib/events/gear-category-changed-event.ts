// type GearCategoryChanged = { category: string };
// export class GearCategoryChangedEvent extends CustomEvent<GearCategoryChanged> {}

import { AppEvent } from "./app-event";

export class GearCategoryChangedEvent extends AppEvent {
    private _category: string;

    public get category(): string {
        return this._category;
    }

    constructor(category: string) {
        super(GearCategoryChangedEvent.name);
        this._category = category;
    }
}
