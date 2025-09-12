import { EquipmentItemFormFieldsDto } from "../equipment-item-form-fields-dto";

export class AddCustomEquipmentItemRequest {
    private _formFields: EquipmentItemFormFieldsDto;
    private _itemId: number;

    public get formFields(): EquipmentItemFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: EquipmentItemFormFieldsDto) {
        this._formFields = value;
    }

    public get itemId(): number {
        return this._itemId;
    }

    public set itemId(value: number) {
        this._itemId = value;
    }

    constructor() {
        this._formFields = new EquipmentItemFormFieldsDto();
        this._itemId = 0;
    }
}
