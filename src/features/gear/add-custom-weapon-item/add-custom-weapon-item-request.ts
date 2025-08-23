import { WeaponItemFormFieldsDto } from "../weapon-item-form-fields-dto";

export class AddCustomWeaponItemRequest {
    private _formFields: WeaponItemFormFieldsDto;

    public get formFields(): WeaponItemFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: WeaponItemFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        this._formFields = new WeaponItemFormFieldsDto();
    }
}
