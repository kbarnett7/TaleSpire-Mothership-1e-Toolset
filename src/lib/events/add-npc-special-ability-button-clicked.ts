import { AppEvent } from "./app-event";

export class AddNpcSpecialAbilityButtonClicked extends AppEvent {
    constructor() {
        super(AddNpcSpecialAbilityButtonClicked.name);
    }
}
