import { AppEvent } from "./app-event";

export class GearItemDeletedEvent extends AppEvent {
    constructor() {
        super(GearItemDeletedEvent.name);
    }
}
