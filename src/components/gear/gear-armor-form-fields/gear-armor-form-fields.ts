import html from "./gear-armor-form-fields.html";
import { BaseComponent } from "../../base.component";
import { ArmorItemFormFieldsDto } from "../../../features/gear/armor-item-form-fields-dto";
import { ArmorItem } from "../../../features/gear/armor-item";

export class GearArmorFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: ArmorItemFormFieldsDto;

    public get armorPointsInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputArmorPoints") as HTMLInputElement;
    }

    public get oxygenInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputOxygen") as HTMLInputElement;
    }

    public get speedSelectElement(): HTMLSelectElement {
        return this.shadow.querySelector("#inputSpeed") as HTMLSelectElement;
    }

    public get specialInputElement(): HTMLTextAreaElement {
        return this.shadow.querySelector("#inputSpecial") as HTMLTextAreaElement;
    }

    public get value(): string {
        return this._formFieldsDto.toJson();
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = new ArmorItemFormFieldsDto();
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public setInitialFormValues(item: ArmorItem) {
        this.armorPointsInputElement.value = item.armorPoints.toString();
        this.oxygenInputElement.value = item.oxygen.toString();
        this.speedSelectElement.value = item.speed;
        this.specialInputElement.value = item.special;

        this._formFieldsDto.armorPoints = item.armorPoints.toString();
        this._formFieldsDto.oxygen = item.oxygen.toString();
        this._formFieldsDto.speed = item.speed;
        this._formFieldsDto.special = item.special;

        this.updateFormValue();
    }

    public handleOnArmorPointsInputChanged(event: Event) {
        this._formFieldsDto.armorPoints = this.armorPointsInputElement.value;
        this.updateFormValue();
    }

    public handleOnOxygenInputChanged(event: Event) {
        this._formFieldsDto.oxygen = this.oxygenInputElement.value;
        this.updateFormValue();
    }

    public handleOnSpeedSelectChanged(event: Event) {
        this._formFieldsDto.speed = this.speedSelectElement.value;
        this.updateFormValue();
    }

    public handleOnSpecialInputChanged(event: Event) {
        this._formFieldsDto.special = this.specialInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("gear-armor-form-fields", GearArmorFormFieldsComponent);
