import { ArmorItemFormFieldsDto } from "../armor-item-form-fields-dto";

export class SaveCustomArmorItemRequest {
    private _formFields: ArmorItemFormFieldsDto;

    public get formFields(): ArmorItemFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: ArmorItemFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        this._formFields = new ArmorItemFormFieldsDto();
    }
}
