import html from "./modal-dialog.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { OpenGearModalEvent } from "../../lib/events/open-gear-modal-event";
import { AppEvent } from "../../lib/events/app-event";

export class ModalDialogComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(OpenGearModalEvent.name, (event: AppEvent) => {
            this.onOpenDialog(event as OpenGearModalEvent);
        });
    }

    public onOpenDialog(event: OpenGearModalEvent) {
        EventBus.instance.registerBrowserEvent("keyup", this.onKeyupEvent);

        this.showModal();
    }

    private showModal() {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.remove("hidden");
        dialog.classList.add("flex");
    }

    public onCloseDialog(event: MouseEvent) {
        this.closeModal();
    }

    private closeModal() {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.add("hidden");
        dialog.classList.remove("flex");

        EventBus.instance.unregisterBrowserEvent("keyup", this.onKeyupEvent);
    }

    private onKeyupEvent = (event: Event) => {
        if (event instanceof KeyboardEvent && event.key === "Escape") {
            this.closeModal();
        }
    };
}

customElements.define("modal-dialog", ModalDialogComponent);
