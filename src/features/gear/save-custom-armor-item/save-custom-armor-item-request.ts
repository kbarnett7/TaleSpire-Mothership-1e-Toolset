import { SaveDbEntityRequest } from "../../../lib/common/features/save-db-entity-request";
import { ArmorItemFormFieldsDto } from "../armor-item-form-fields-dto";

export class SaveCustomArmorItemRequest extends SaveDbEntityRequest {
    private _formFields: ArmorItemFormFieldsDto;

    public get formFields(): ArmorItemFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: ArmorItemFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        super();
        this._formFields = new ArmorItemFormFieldsDto();
    }
}
