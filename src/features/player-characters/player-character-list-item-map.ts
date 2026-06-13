import { PlayerCharacter } from "./player-character";
import { PlayerCharacterListItem } from "./player-character-list-item";

export class PlayerCharacterListItemMap {
    static fromPlayerCharacter(pc: PlayerCharacter): PlayerCharacterListItem {
        return new PlayerCharacterListItem(pc.id, pc.name, pc.characterClass, pc.description);
    }
}
