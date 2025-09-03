import { AppEvent } from "./app-event";

export class RefreshGearListEvent extends AppEvent {
    constructor() {
        super(RefreshGearListEvent.name);
    }
}
