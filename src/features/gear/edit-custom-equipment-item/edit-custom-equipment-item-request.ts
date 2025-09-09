import { EquipmentItemFormFieldsDto } from "../equipment-item-form-fields-dto";

export class EditCustomEquipmentItemRequest {
    private _formFields: EquipmentItemFormFieldsDto;

    public get formFields(): EquipmentItemFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: EquipmentItemFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        this._formFields = new EquipmentItemFormFieldsDto();
    }
}
