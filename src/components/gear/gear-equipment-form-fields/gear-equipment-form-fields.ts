import html from "./gear-equipment-form-fields.html";
import { BaseComponent } from "../../base.component";
import { EquipmentItem } from "../../../features/gear/equipment-item";

export class GearEquipmentFormFieldsComponent extends BaseComponent {
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
        const paragraph = this.shadow.querySelector("#inputName") as HTMLParagraphElement;
        paragraph.textContent = this.equipmentItem.name;
    }

    private updateGearDescription() {
        const paragraph = this.shadow.querySelector("#inputDescription") as HTMLParagraphElement;
        paragraph.textContent = this.equipmentItem.description;
    }

    private updateGearCost() {
        const paragraph = this.shadow.querySelector("#inputCost") as HTMLParagraphElement;
        paragraph.textContent = this.equipmentItem.cost.toString();
    }
}

customElements.define("gear-equipment-form-fields", GearEquipmentFormFieldsComponent);
