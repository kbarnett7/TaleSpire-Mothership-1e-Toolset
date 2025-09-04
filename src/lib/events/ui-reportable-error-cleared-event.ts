import { AppEvent } from "./app-event";

export class UiReportableErrorClearedEvent extends AppEvent {
    constructor() {
        super(UiReportableErrorClearedEvent.name);
    }
}
