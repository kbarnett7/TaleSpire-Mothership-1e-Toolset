import { AppEvent } from "./app-event";

export class NpcDeletedEvent extends AppEvent {
    constructor() {
        super(NpcDeletedEvent.name);
    }
}
