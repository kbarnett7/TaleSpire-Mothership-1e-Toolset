import { AppEvent } from "./app-event";

export class HideNavigateBackButtonEvent extends AppEvent {
    constructor() {
        super(HideNavigateBackButtonEvent.name);
    }
}
