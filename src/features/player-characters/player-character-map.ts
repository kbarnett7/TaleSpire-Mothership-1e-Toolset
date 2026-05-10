import { PlayerCharacter } from "./player-character";
import { PlayerCharacterFormFieldsDto } from "./player-character-form-fields-dto";

export class PlayerCharacterMap {
    static fromFormFields(formFields: PlayerCharacterFormFieldsDto): PlayerCharacter {
        return new PlayerCharacter(0, formFields.name, formFields.characterClass, formFields.description);
    }
}
