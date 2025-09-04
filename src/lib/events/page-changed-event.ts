import { AppEvent } from "./app-event";

export class PageChangedEvent extends AppEvent {
    public newTitle: string;

    constructor(newTitle: string) {
        super(PageChangedEvent.name);
        this.newTitle = newTitle;
    }
}
