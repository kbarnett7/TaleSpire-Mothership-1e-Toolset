import { AppEvent } from "./app-event";

export class PlayerCharacterDeletedEvent extends AppEvent {
    constructor() {
        super(PlayerCharacterDeletedEvent.name);
    }
}
