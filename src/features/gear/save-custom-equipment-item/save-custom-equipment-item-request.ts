import { SaveDbEntityRequest } from "../../../lib/common/features/save-db-entity-request";
import { EquipmentItemFormFieldsDto } from "../equipment-item-form-fields-dto";

export class SaveCustomEquipmentItemRequest extends SaveDbEntityRequest {
    private _formFields: EquipmentItemFormFieldsDto;

    public get formFields(): EquipmentItemFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: EquipmentItemFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        super();
        this._formFields = new EquipmentItemFormFieldsDto();
    }
}
