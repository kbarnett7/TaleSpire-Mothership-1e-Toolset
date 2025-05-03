import { GetAllGearFeature } from "../../src/features/gear/get-all-gear/get-all-gear-feature";
import { FilterGearListFeature } from "../../src/features/gear/filter-gear-list/filter-gear-list-feature";
import { FilterGearListRequest } from "../../src/features/gear/filter-gear-list/filter-gear-list-request";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { GearListItem } from "../../src/features/gear/gear-list-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { Result } from "../../src/lib/result/result";
import { UnitTestDatabase } from "../data/unit-test-database";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { GearItem } from "../../src/features/gear/gear-item";

describe("Gear Features", () => {
    it("GetAllGearFeature returns all gear list items", () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new GetAllGearFeature(unitOfWork);

        // Act
        const gear: GearListItem[] = feature.handle(new EmptyRequest());

        // Assert
        expect(gear.length).toBeGreaterThan(0);

        let item: GearListItem = getGearItemByName(gear, "Assorted Tools");
        expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = getGearItemByName(gear, "Standard Crew Attire");
        expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = getGearItemByName(gear, "Boarding Axe");
        expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it("FilterGearListFeature for empty list returns an empty list of gear list items", () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.gearItemList = new Array<GearListItem>();

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(0);
    });

    it("FilterGearListFeature by invalid category returns the original list", () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.gearItemList = getAllGearListItems();
        request.category = "invalid-category";

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];
        let item: GearListItem = getGearItemByName(gear, "Assorted Tools");
        expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = getGearItemByName(gear, "Standard Crew Attire");
        expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = getGearItemByName(gear, "Boarding Axe");
        expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it('FilterGearListFeature by "All" returns a list of all gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.gearItemList = getAllGearListItems();
        request.category = GearItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];
        let item: GearListItem = getGearItemByName(gear, "Assorted Tools");
        expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = getGearItemByName(gear, "Standard Crew Attire");
        expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = getGearItemByName(gear, "Boarding Axe");
        expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it('FilterGearListFeature by "Armor" returns a list of all armor gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.gearItemList = getAllGearListItems();
        request.category = ArmorItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];
        let item: GearListItem = getGearItemByName(gear, "Assorted Tools");
        expect(item.id).toBe(0);

        item = getGearItemByName(gear, "Standard Crew Attire");
        expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = getGearItemByName(gear, "Boarding Axe");
        expect(item.id).toBe(0);
    });

    it('FilterGearListFeature by "Equipment" returns a list of all equipment gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.gearItemList = getAllGearListItems();
        request.category = EquipmentItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];
        let item: GearListItem = getGearItemByName(gear, "Assorted Tools");
        expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = getGearItemByName(gear, "Standard Crew Attire");
        expect(item.id).toBe(0);

        item = getGearItemByName(gear, "Boarding Axe");
        expect(item.id).toBe(0);
    });

    it('FilterGearListFeature by "Weapon" returns a list of all weapon gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.gearItemList = getAllGearListItems();
        request.category = WeaponItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];
        let item: GearListItem = getGearItemByName(gear, "Assorted Tools");
        expect(item.id).toBe(0);

        item = getGearItemByName(gear, "Standard Crew Attire");
        expect(item.id).toBe(0);

        item = getGearItemByName(gear, "Boarding Axe");
        expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    function getGearItemByName(gear: GearListItem[], name: string): GearListItem {
        const foundItem = gear.find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new GearListItem(0, "", "", 0, "");
    }

    function getAllGearListItems(): GearListItem[] {
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new GetAllGearFeature(unitOfWork);

        return feature.handle(new EmptyRequest());
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
