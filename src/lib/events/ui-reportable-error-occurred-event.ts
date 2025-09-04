import { AppErrorEvent } from "./app-error-event";

export class UiReportableErrorOccurredEvent extends AppErrorEvent {
    constructor(error: string, details?: string[]) {
        super(UiReportableErrorOccurredEvent.name, error, details);
    }
}
