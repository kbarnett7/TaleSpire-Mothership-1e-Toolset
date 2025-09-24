import html from "./gear-weapon-form-fields.html";
import { BaseComponent } from "../../base.component";
import { WeaponItem } from "../../../features/gear/weapon-item";
import { WeaponItemFormFieldsDto } from "../../../features/gear/weapon-item-form-fields-dto";
import { CustomSelectComponent } from "../../custom-select/custom-select";
import { SelectOption } from "../../../lib/selects/select-option";
import { WeaponCategory } from "../../../features/gear/weapon-category";
import { WeaponRange } from "../../../features/gear/weapon-range";

export class GearWeaponFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: WeaponItemFormFieldsDto;

    public get weaponCategorySelectElement(): CustomSelectComponent {
        return this.shadow.querySelector("#inputWeaponCategory") as CustomSelectComponent;
    }

    public get rangeSelectElement(): CustomSelectComponent {
        return this.shadow.querySelector("#inputRange") as CustomSelectComponent;
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
        this.configureWeaponCategorySelectElement();
        this.configureRangeSelectElement();
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public setInitialFormValues(item: WeaponItem) {
        this.weaponCategorySelectElement.value = item.category;
        this.rangeSelectElement.value = item.range;
        this.damageInputElement.value = item.damage;
        this.shotsInputElement.value = item.shots.toString();
        this.woundInputElement.value = item.wound;
        this.specialInputElement.value = item.special;

        this._formFieldsDto.category = item.category;
        this._formFieldsDto.range = item.range;
        this._formFieldsDto.damage = item.damage;
        this._formFieldsDto.shots = item.shots.toString();
        this._formFieldsDto.wound = item.wound;
        this._formFieldsDto.special = item.special;

        this.updateFormValue();
    }

    private configureWeaponCategorySelectElement() {
        this.weaponCategorySelectElement.onOptionChange = this.handleOnWeaponCategorySelectChanged;
        this.populateWeaponCategorySelectElement();
    }

    private populateWeaponCategorySelectElement() {
        const weaponCategoryOptions = Object.values(WeaponCategory).map((value) => new SelectOption(value, value));

        this.weaponCategorySelectElement.populateOptions(weaponCategoryOptions);
    }

    private configureRangeSelectElement() {
        this.rangeSelectElement.onOptionChange = this.handleOnRangeSelectChanged;
        this.populateRangeSelectElement();
    }

    private populateRangeSelectElement() {
        const rangeOptions = Object.values(WeaponRange).map((value) => new SelectOption(value, value));

        this.rangeSelectElement.populateOptions(rangeOptions);
    }

    public handleOnWeaponCategorySelectChanged = (newValue: SelectOption) => {
        this._formFieldsDto.category = newValue.value;
        this.updateFormValue();
    };

    public handleOnRangeSelectChanged = (newValue: SelectOption) => {
        this._formFieldsDto.range = newValue.value;
        this.updateFormValue();
    };

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
