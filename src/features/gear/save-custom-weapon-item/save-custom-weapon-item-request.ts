import { SaveDbEntityRequest } from "../../../lib/common/features/save-db-entity-request";
import { WeaponItemFormFieldsDto } from "../weapon-item-form-fields-dto";

export class SaveCustomWeaponItemRequest extends SaveDbEntityRequest {
    private _formFields: WeaponItemFormFieldsDto;

    public get formFields(): WeaponItemFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: WeaponItemFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        super();
        this._formFields = new WeaponItemFormFieldsDto();
    }
}
