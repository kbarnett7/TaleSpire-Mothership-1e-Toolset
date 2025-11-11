import html from "./confirmation-dialog.html";
import { BaseComponent } from "../base.component";
import { ModalDialogComponent } from "../modal-dialog/modal-dialog";
import { EventBus } from "../../lib/events/event-bus";
import { UiReportableErrorOccurredEvent } from "../../lib/events/ui-reportable-error-occurred-event";

export class ConfirmationDialogComponent extends BaseComponent {
    public onConfirmCallback: () => void;
    public onCancelCallback: () => void;

    protected get modalElement(): ModalDialogComponent {
        return this.shadow.querySelector("#confirmationModal") as ModalDialogComponent;
    }

    constructor() {
        super();
        this.onConfirmCallback = this.defaultOnConfirmCallback;
        this.onCancelCallback = this.defaultOnCancelCallback;
    }

    public connectedCallback() {
        this.render(html);
    }

    public openModal() {
        const modal = this.modalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.openModal();
    }

    public closeModal() {
        const modal = this.modalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.closeModal();
    }

    private dispatchModalNotFoundEvent() {
        EventBus.instance.dispatch(new UiReportableErrorOccurredEvent('Modal "npcDisplayDialog" not found.'));
    }

    public onConfirmationButtonClick(event: MouseEvent) {
        this.onConfirmCallback();
        this.closeModal();
    }

    public onCancelButtonClick(event: MouseEvent) {
        this.onCancelCallback();
        this.closeModal();
    }

    private defaultOnConfirmCallback(): void {
        // intentionally do nothing...
    }

    private defaultOnCancelCallback(): void {
        // intentionally do nothing...
    }
}

customElements.define("confirmation-dialog", ConfirmationDialogComponent);
