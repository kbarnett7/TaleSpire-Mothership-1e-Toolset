import html from "./modal-dialog.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";

export class ModalDialogComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    public openModal() {
        EventBus.instance.registerBrowserEvent("keyup", this.onKeyupEvent);

        this.showModal();
    }

    private showModal() {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.remove("hidden");
        dialog.classList.add("flex");
    }

    private closeModal() {
        this.hideModal();

        EventBus.instance.unregisterBrowserEvent("keyup", this.onKeyupEvent);
    }

    private hideModal() {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.add("hidden");
        dialog.classList.remove("flex");
    }

    public onCloseModal(event: MouseEvent) {
        this.closeModal();
    }

    private onKeyupEvent = (event: Event) => {
        if (event instanceof KeyboardEvent && event.key === "Escape") {
            this.closeModal();
        }
    };
}

customElements.define("modal-dialog", ModalDialogComponent);
