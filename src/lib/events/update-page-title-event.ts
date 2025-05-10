import { AppEvent } from "./app-event";

export class UpdatePageTitleEvent extends AppEvent {
    public newTitle: string;

    constructor(newTitle: string) {
        super(UpdatePageTitleEvent.name);
        this.newTitle = newTitle;
    }
}
