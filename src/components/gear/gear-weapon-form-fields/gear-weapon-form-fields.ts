import html from "./gear-weapon-form-fields.html";
import { BaseComponent } from "../../base.component";
import { WeaponItem } from "../../../features/gear/weapon-item";
import { WeaponItemFormFieldsDto } from "../../../features/gear/weapon-item-form-fields-dto";

export class GearWeaponFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: WeaponItemFormFieldsDto;

    public get weaponCategorySelectElement(): HTMLSelectElement {
        return this.shadow.querySelector("#inputWeaponCategory") as HTMLSelectElement;
    }

    public get rangeSelectElement(): HTMLSelectElement {
        return this.shadow.querySelector("#inputRange") as HTMLSelectElement;
    }

    public get damageInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputDamage") as HTMLInputElement;
    }

    public get shotsInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputShots") as HTMLInputElement;
    }

    public get woundInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputWound") as HTMLInputElement;
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
        this._formFieldsDto = new WeaponItemFormFieldsDto();
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public handleOnWeaponCategorySelectChanged(event: Event) {
        this._formFieldsDto.category = this.weaponCategorySelectElement.value;
        this.updateFormValue();
    }

    public handleOnRangeSelectChanged(event: Event) {
        this._formFieldsDto.range = this.rangeSelectElement.value;
        this.updateFormValue();
    }

    public handleOnDamageInputChanged(event: Event) {
        this._formFieldsDto.damage = this.damageInputElement.value;
        this.updateFormValue();
    }

    public handleOnShotsInputChanged(event: Event) {
        this._formFieldsDto.shots = this.shotsInputElement.value;
        this.updateFormValue();
    }

    public handleOnWoundInputChanged(event: Event) {
        this._formFieldsDto.wound = this.woundInputElement.value;
        this.updateFormValue();
    }

    public handleOnSpecialInputChanged(event: Event) {
        this._formFieldsDto.special = this.specialInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("gear-weapon-form-fields", GearWeaponFormFieldsComponent);
