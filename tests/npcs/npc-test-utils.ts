import { NpcListItem } from "../../src/features/npcs/npc-list-item";

export class NpcTestUtils {
    static getNpcItemByName(npcs: NpcListItem[], name: string): NpcListItem {
        const foundItem = npcs.find((npc) => npc.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new NpcListItem(0, "");
    }
}
