import { NpcListItem } from "../../src/features/npcs/npc-list-item";

export class NpcTestUtils {
    static getNpcItemByName(npcs: NpcListItem[], name: string): NpcListItem {
        const foundItem = npcs.find((npc) => npc.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new NpcListItem(0, 0, "", 0, 0, 0, 0, 0);
    }

    static expectNpcToBe(actualNpc: NpcListItem, expectedId: number, expectedSourceId: number, expectedName: string) {
        expect(actualNpc.id).toBe(expectedId);
        expect(actualNpc.sourceId).toBe(expectedSourceId);
        expect(actualNpc.name).toBe(expectedName);
    }
}
