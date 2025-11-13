import { Npc } from "./npc";
import { NpcListItem } from "./npc-list-item";

export class NpcListItemMap {
    static fromNpc(npc: Npc): NpcListItem {
        return new NpcListItem(
            npc.id,
            npc.sourceId,
            npc.name,
            npc.combat,
            npc.instinct,
            npc.armorPoints,
            npc.health,
            npc.maximumWounds
        );
    }
}
