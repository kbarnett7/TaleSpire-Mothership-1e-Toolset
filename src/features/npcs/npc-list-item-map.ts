import { Npc } from "./npc";
import { NpcListItem } from "./npc-list-item";

export class NpcListItemMap {
    static fromNpc(npc: Npc): NpcListItem {
        return new NpcListItem(npc.id, npc.name);
    }
}
