import { PlayerCharacter } from "./player-character";
import { PlayerCharacterFormFieldsDto } from "./player-character-form-fields-dto";

export class PlayerCharacterMap {
    static fromFormFields(dto: PlayerCharacterFormFieldsDto): PlayerCharacter {
        return new PlayerCharacter(0, dto.name, dto.characterClass, dto.description);
    }
}
