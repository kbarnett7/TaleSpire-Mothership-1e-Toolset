import { NpcListItem } from "../../src/features/npcs/npc-list-item";
import { IRepository } from "../../src/lib/common/data-access/repository-interface";

export class NpcTestUtils {
    static getNpcItemByName(npcs: NpcListItem[], name: string): NpcListItem {
        const foundItem = npcs.find((npc) => npc.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new NpcListItem(0, "", 0, 0, 0, 0, 0);
    }

    static getLargestNpcIdInDatabase(repository: IRepository<any>): number {
        const sortedItems = repository.list().sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    static resetNpcListInDatabase(repository: IRepository<any>, largestId: number) {
        const gear = repository.list();

        for (let item of gear) {
            if (item.id > largestId) {
                repository.remove(item);
            }
        }
    }
}
