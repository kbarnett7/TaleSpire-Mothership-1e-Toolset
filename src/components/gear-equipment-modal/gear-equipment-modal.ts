import html from "./gear-equipment-modal.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { OpenGearModalEvent } from "../../lib/events/open-gear-modal-event";
import { AppEvent } from "../../lib/events/app-event";

export class GearEquipmentModalComponent extends BaseComponent {
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
        this.setModalHeader(event);
        this.showModal();
    }

    private setModalHeader(event: OpenGearModalEvent) {
        const header = this.shadow.querySelector("#modalHeaderText") as HTMLHeadElement;
        header.textContent = "FAKE ITEM";
    }

    private showModal() {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.remove("hidden");
        dialog.classList.add("flex");
    }

    public onCloseDialog(event: MouseEvent) {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.add("hidden");
        dialog.classList.remove("flex");
    }
}

customElements.define("gear-equipment-modal", GearEquipmentModalComponent);
