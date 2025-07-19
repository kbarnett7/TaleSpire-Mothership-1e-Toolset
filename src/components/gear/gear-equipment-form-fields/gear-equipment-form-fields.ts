import html from "./gear-equipment-form-fields.html";
import { BaseComponent } from "../../base.component";
import { EquipmentItem } from "../../../features/gear/equipment-item";
import { EquipmentItemDto } from "../../../features/gear/equipment-item-dto";

export class GearEquipmentFormFieldsComponent extends BaseComponent {
    static formAssociated = true;
    private _internals: ElementInternals;

    private equipmentItem: EquipmentItem;

    public get nameInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputName") as HTMLInputElement;
    }

    public get costInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputCost") as HTMLInputElement;
    }

    public get descriptionInputElement(): HTMLTextAreaElement {
        return this.shadow.querySelector("#inputDescription") as HTMLTextAreaElement;
    }

    public get value(): string {
        return new EquipmentItemDto(
            this.nameInputElement.value,
            this.descriptionInputElement.value,
            this.costInputElement.value
        ).toJson();
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this.equipmentItem = new EquipmentItem();
    }

    public connectedCallback() {
        this.render(html);
        this._internals.setFormValue(new EquipmentItemDto().toJson());
    }

    public handleOnInputChanged(event: Event) {
        this._internals.setFormValue(this.value);
    }

    public setEquipmentItem(equipmentItem: EquipmentItem) {
        this.equipmentItem = equipmentItem;

        this.updateGearName();
        this.updateGearDescription();
        this.updateGearCost();
    }

    private updateGearName() {
        const paragraph = this.shadow.querySelector("#inputName") as HTMLInputElement;
        paragraph.textContent = this.equipmentItem.name;
    }

    private updateGearDescription() {
        const paragraph = this.shadow.querySelector("#inputDescription") as HTMLInputElement;
        paragraph.textContent = this.equipmentItem.description;
    }

    private updateGearCost() {
        const paragraph = this.shadow.querySelector("#inputCost") as HTMLTextAreaElement;
        paragraph.textContent = this.equipmentItem.cost.toString();
    }
}

customElements.define("gear-equipment-form-fields", GearEquipmentFormFieldsComponent);
