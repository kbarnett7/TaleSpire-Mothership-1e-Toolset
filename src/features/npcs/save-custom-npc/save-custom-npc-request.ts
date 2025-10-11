import { SaveDbEntityRequest } from "../../../lib/common/features/save-db-entity-request";
import { NpcFormFieldsDto } from "../npc-form-fields-dto";

export class SaveCustomNpcRequest extends SaveDbEntityRequest {
    private _formFields: NpcFormFieldsDto;

    public get formFields(): NpcFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: NpcFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        super();
        this._formFields = new NpcFormFieldsDto();
    }
}
