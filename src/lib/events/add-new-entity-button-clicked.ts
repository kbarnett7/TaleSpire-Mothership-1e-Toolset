import { AppEvent } from "./app-event";

export class AddNewEntityButtonClicked extends AppEvent {
    constructor() {
        super(AddNewEntityButtonClicked.name);
    }
}
