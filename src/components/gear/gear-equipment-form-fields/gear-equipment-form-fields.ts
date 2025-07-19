import html from "./gear-equipment-form-fields.html";
import { BaseComponent } from "../../base.component";
import { EquipmentItemDto } from "../../../features/gear/equipment-item-dto";

export class GearEquipmentFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _value: EquipmentItemDto;

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
        return this._value.toJson();
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._value = new EquipmentItemDto();
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public handleOnNameInputChanged(event: Event) {
        this._value.name = this.nameInputElement.value;
        this.updateFormValue();
    }

    public handleOnCostInputChanged(event: Event) {
        this._value.cost = this.costInputElement.value;
        this.updateFormValue();
    }

    public handleOnDescriptionInputChanged(event: Event) {
        this._value.description = this.descriptionInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("gear-equipment-form-fields", GearEquipmentFormFieldsComponent);
