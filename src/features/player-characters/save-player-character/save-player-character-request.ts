import { SaveDbEntityRequest } from "../../../lib/common/features/save-db-entity-request";
import { PlayerCharacterFormFieldsDto } from "../player-character-form-fields-dto";

export class SavePlayerCharacterRequest extends SaveDbEntityRequest {
    private _formFields: PlayerCharacterFormFieldsDto;

    public get formFields(): PlayerCharacterFormFieldsDto {
        return this._formFields;
    }

    public set formFields(value: PlayerCharacterFormFieldsDto) {
        this._formFields = value;
    }

    constructor() {
        super();
        this._formFields = new PlayerCharacterFormFieldsDto();
    }
}
