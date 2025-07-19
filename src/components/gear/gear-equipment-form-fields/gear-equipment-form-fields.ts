import html from "./gear-equipment-form-fields.html";
import { BaseComponent } from "../../base.component";
import { EquipmentItem } from "../../../features/gear/equipment-item";

export class GearEquipmentFormFieldsComponent extends BaseComponent {
    static formAssociated = true;
    private _internals: ElementInternals;

    private equipmentItem: EquipmentItem;

    public get nameInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputName") as HTMLInputElement;
    }

    public get value(): string {
        return JSON.stringify(new EquipmentItem(0, 1, this.nameInputElement.value));
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this.equipmentItem = new EquipmentItem();
    }

    public connectedCallback() {
        this.render(html);
        // set a defautl value
        this._internals.setFormValue(JSON.stringify(new EquipmentItem()));

        // const inputs = this.shadow.querySelectorAll("input");
        // const textAreas = this.shadow.querySelectorAll("textarea");
    }

    public handleOnInputNameChanged(event: Event) {
        this._internals.setFormValue(this.value);
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
