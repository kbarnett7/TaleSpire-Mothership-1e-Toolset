import { AppEvent } from "./app-event";

export class OpenGearModalEvent extends AppEvent {
    private readonly _gearItemId: number;
    private readonly _gearItemCategory: string;

    public get gearItemId(): number {
        return this._gearItemId;
    }

    public get gearItemCategory(): string {
        return this._gearItemCategory;
    }

    constructor(gearItemId: number, gearItemCategory: string) {
        super(OpenGearModalEvent.name);
        this._gearItemId = gearItemId;
        this._gearItemCategory = gearItemCategory;
    }
}
