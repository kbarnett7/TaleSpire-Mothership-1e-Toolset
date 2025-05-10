import html from "./gear-equipment-form.html";
import { BaseComponent } from "../base.component";
import { CreditsAbbreviator } from "../../lib/services/credits-abbreviator";
import { AppLogger } from "../../lib/logging/app-logger";
import { SelectedGearItem } from "../../features/gear/selected-gear-item";
import { EquipmentItem } from "../../features/gear/equipment-item";
import { GetGearByIdFeature } from "../../features/gear/get-gear-by-id/get-gear-by-id-feature";
import { GetGearByIdRequest } from "../../features/gear/get-gear-by-id/get-gear-by-id-request";
import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { appInjector } from "../../lib/infrastructure/app-injector";

export class GearEquipmentForm extends BaseComponent {
    static observedAttributes = ["selected-gear-item"];

    private unitOfWork: IUnitOfWork;

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
    }

    public connectedCallback() {
        this.render(html);
    }

    public attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        AppLogger.instance.debug(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);

        if (name === "selected-gear-item") {
            this.onGearEquipmentItemChange(JSON.parse(newValue) as SelectedGearItem);
        }
    }

    public onGearEquipmentItemChange(selectedGearItem: SelectedGearItem) {
        const gearItem = this.getSelectedGearItem(selectedGearItem);

        this.setGearName(gearItem.name);
        this.setGearDescription(gearItem.description);
        this.setGearCost(gearItem.cost);
    }

    private getSelectedGearItem(selectedGearItem: SelectedGearItem): EquipmentItem {
        const feature = new GetGearByIdFeature(this.unitOfWork);
        const request = new GetGearByIdRequest(selectedGearItem.id, selectedGearItem.category);

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
}

customElements.define("gear-equipment-form", GearEquipmentForm);
