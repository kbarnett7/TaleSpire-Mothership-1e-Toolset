import html from "./gear-equipment-modal.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { OpenGearModalEvent } from "../../lib/events/open-gear-modal-event";
import { AppEvent } from "../../lib/events/app-event";
import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { GetGearByIdFeature } from "../../features/gear/get-gear-by-id/get-gear-by-id-feature";
import { GetGearByIdRequest } from "../../features/gear/get-gear-by-id/get-gear-by-id-request";
import { EquipmentItem } from "../../features/gear/equipment-item";
import { CreditsAbbreviator } from "../../lib/services/credits-abbreviator";

export class GearEquipmentModalComponent extends BaseComponent {
    private unitOfWork: IUnitOfWork;

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(OpenGearModalEvent.name, (event: AppEvent) => {
            this.onOpenDialog(event as OpenGearModalEvent);
        });
    }

    public onOpenDialog(event: OpenGearModalEvent) {
        const gearItem = this.getSelectedGearItem(event);

        this.setGearName(gearItem.name);
        this.setGearDescription(gearItem.description);
        this.setGearCost(gearItem.cost);

        EventBus.instance.registerBrowserEvent("keyup", this.onKeyupEvent);

        this.showModal();
    }

    private getSelectedGearItem(event: OpenGearModalEvent): EquipmentItem {
        const feature = new GetGearByIdFeature(this.unitOfWork);
        const request = new GetGearByIdRequest(event.gearItemId, event.gearItemCategory);

        return feature.handle(request) as EquipmentItem;
    }

    private setGearName(name: string) {
        const paragraph = this.shadow.querySelector("#gearName") as HTMLParagraphElement;
        paragraph.textContent = name;
    }

    private setGearDescription(description: string) {
        const paragraph = this.shadow.querySelector("#gearDescription") as HTMLParagraphElement;
        paragraph.textContent = description;
    }

    private setGearCost(cost: number) {
        const paragraph = this.shadow.querySelector("#gearCost") as HTMLParagraphElement;
        paragraph.textContent = CreditsAbbreviator.instance.abbreviate(cost);
    }

    private showModal() {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.remove("hidden");
        dialog.classList.add("flex");
    }

    private onKeyupEvent = (event: Event) => {
        if (event instanceof KeyboardEvent && event.key === "Escape") {
            this.closeModal();
        }
    };

    public onCloseDialog(event: MouseEvent) {
        this.closeModal();
    }

    private closeModal() {
        const dialog = this.shadow.querySelector("#modalDialog") as HTMLDivElement;

        dialog.classList.add("hidden");
        dialog.classList.remove("flex");

        EventBus.instance.unregisterBrowserEvent("keyup", this.onKeyupEvent);
    }
}

customElements.define("gear-equipment-modal", GearEquipmentModalComponent);
