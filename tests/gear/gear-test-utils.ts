import { GearListItem } from "../../src/features/gear/gear-list-item";
import { IRepository } from "../../src/lib/common/data-access/repository-interface";

export class GearTestUtils {
    static getGearItemByName(gear: GearListItem[], name: string): GearListItem {
        const foundItem = gear.find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new GearListItem(0, 0, "", "", 0, "");
    }

    static getLargestGearItemIdInDatabase(repository: IRepository<any>): number {
        const sortedItems = repository.list().sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    static resetGearItemListInDatabase(repository: IRepository<any>, largestId: number) {
        const gear = repository.list();

        for (let item of gear) {
            if (item.id > largestId) {
                repository.remove(item);
            }
        }
    }

    static expectItemToBe(
        actualItem: GearListItem,
        expectedId: number,
        expectedSourceId: number,
        expectedName: string,
        expectedCost: number,
        expectedCategory: string
    ) {
        expect(actualItem.id).toBe(expectedId);
        expect(actualItem.sourceId).toBe(expectedSourceId);
        expect(actualItem.name).toBe(expectedName);
        expect(actualItem.cost).toBe(expectedCost);
        expect(actualItem.category).toBe(expectedCategory);
    }
}
