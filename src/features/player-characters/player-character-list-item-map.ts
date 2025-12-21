import { PlayerCharacter } from "./player-character";
import { PlayerCharacterListItem } from "./player-character-list-item";

export class PlayerCharacterListItemMap {
    static fromNpc(npc: PlayerCharacter): PlayerCharacterListItem {
        return new PlayerCharacterListItem(npc.id, npc.name, npc.characterClass, npc.description);
    }
}
