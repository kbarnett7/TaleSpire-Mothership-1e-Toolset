import html from "./gear-equipment-display.html";
import { BaseComponent } from "../../base.component";
import { CreditsAbbreviator } from "../../../lib/services/credits-abbreviator";
import { EquipmentItem } from "../../../features/gear/equipment-item";

export class GearEquipmentDisplayComponent extends BaseComponent {
    private equipmentItem: EquipmentItem;

    constructor() {
        super();
        this.equipmentItem = new EquipmentItem();
    }

    public connectedCallback() {
        this.render(html);
    }

    public setEquipmentItem(equipmentItem: EquipmentItem) {
        this.equipmentItem = equipmentItem;

        this.updateGearName();
        this.updateGearDescription();
        this.updateGearCost();
    }

    private updateGearName() {
        const paragraph = this.shadow.querySelector("#gearName") as HTMLParagraphElement;
        paragraph.textContent = this.equipmentItem.name;
    }

    private updateGearDescription() {
        const paragraph = this.shadow.querySelector("#gearDescription") as HTMLParagraphElement;
        paragraph.textContent = this.equipmentItem.description;
    }

    private updateGearCost() {
        const paragraph = this.shadow.querySelector("#gearCost") as HTMLParagraphElement;
        paragraph.textContent = CreditsAbbreviator.instance.abbreviate(this.equipmentItem.cost);
    }
}

customElements.define("gear-equipment-display", GearEquipmentDisplayComponent);
