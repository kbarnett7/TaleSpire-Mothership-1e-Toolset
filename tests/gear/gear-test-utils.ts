import { GearListItem } from "../../src/features/gear/gear-list-item";

export class GearTestUtils {
    static getGearItemByName(gear: GearListItem[], name: string): GearListItem {
        const foundItem = gear.find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new GearListItem(0, "", "", 0, "");
    }

    static expectItemToBe(
        actualItem: GearListItem,
        expectedId: number,
        expectedName: string,
        expectedCost: number,
        expectedCategory: string
    ) {
        expect(actualItem.id).toBe(expectedId);
        expect(actualItem.name).toBe(expectedName);
        expect(actualItem.cost).toBe(expectedCost);
        expect(actualItem.category).toBe(expectedCategory);
    }
}
