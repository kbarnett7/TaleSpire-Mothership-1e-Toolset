import { PlayerCharacter } from "./player-character";
import { PlayerCharacterFormFieldsDto } from "./player-character-form-fields-dto";

export class PlayerCharacterMap {
    static fromFormFields(formFields: PlayerCharacterFormFieldsDto): PlayerCharacter {
        return new PlayerCharacter(
            0,
            formFields.name,
            formFields.characterClass,
            formFields.description,
            !isNaN(Number(formFields.strength)) ? parseInt(formFields.strength) : -1,
            !isNaN(Number(formFields.speed)) ? parseInt(formFields.speed) : -1,
            !isNaN(Number(formFields.intellect)) ? parseInt(formFields.intellect) : -1,
            !isNaN(Number(formFields.combat)) ? parseInt(formFields.combat) : -1,
        );
    }
}
