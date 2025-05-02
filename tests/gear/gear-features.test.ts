import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { GearListItem } from "../../src/features/gear/gear-list-item";
import { GetAllGearFeature } from "../../src/features/gear/get-all-gear/get-all-gear-feature";

describe("Gear Features", () => {
    it("GetAllGearFeature returns all gear list items", () => {
        // Arranges
        const handler = new GetAllGearFeature();

        // Act
        const gear: GearListItem[] = handler.handle();

        // Assert
        expect(gear.length).toBeGreaterThan(0);

        let item: GearListItem = getGearItemByName(gear, "Assorted Tools");
        expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.name.replace("Item", ""));

        item = getGearItemByName(gear, "Standard Crew Attire");
        expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.name.replace("Item", ""));
    });

    function getGearItemByName(gear: GearListItem[], name: string): GearListItem {
        const foundItem = gear.find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new GearListItem(0, "", "", 0, "");
    }

    function expectItemToBe(
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
});
