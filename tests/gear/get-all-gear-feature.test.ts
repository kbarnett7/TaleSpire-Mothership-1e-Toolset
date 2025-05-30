import { ArmorItem } from "../../src/features/gear/armor-item";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { GearListItem } from "../../src/features/gear/gear-list-item";
import { GetAllGearFeature } from "../../src/features/gear/get-all-gear/get-all-gear-feature";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { UnitTestDatabase } from "../data/unit-test-database";
import { GearTestUtils } from "./gear-test-utils";

describe("GetAllGearFeature", () => {
    it("Returns all gear list items", () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new GetAllGearFeature(unitOfWork);

        // Act
        const gear: GearListItem[] = feature.handle(new EmptyRequest());

        // Assert
        expect(gear.length).toBeGreaterThan(0);

        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        GearTestUtils.expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        GearTestUtils.expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        GearTestUtils.expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });
});
