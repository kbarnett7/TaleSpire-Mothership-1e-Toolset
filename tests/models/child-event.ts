import { AppEvent } from "../../src/lib/events/app-event";

export class ChildEvent extends AppEvent {
    public value: string;

    constructor(value: string) {
        super(ChildEvent.name);
        this.value = value;
    }
}
