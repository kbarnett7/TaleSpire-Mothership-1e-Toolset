import { AppEvent } from "./app-event";

export class AddNpcAttackButtonClicked extends AppEvent {
    constructor() {
        super(AddNpcAttackButtonClicked.name);
    }
}
