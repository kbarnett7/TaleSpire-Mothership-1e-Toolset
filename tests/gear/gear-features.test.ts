import { GetAllGearFeature } from "../../src/features/gear/get-all-gear/get-all-gear-feature";
import { FilterGearListFeature } from "../../src/features/gear/filter-gear-list/filter-gear-list-feature";
import { FilterGearListRequest } from "../../src/features/gear/filter-gear-list/filter-gear-list-request";
import { SortGearListFeature } from "../../src/features/gear/sort-gear-list/sort-gear-list-feature";
import { SortGearListRequest } from "../../src/features/gear/sort-gear-list/sort-gear-list-request";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { GearListItem } from "../../src/features/gear/gear-list-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { Result } from "../../src/lib/result/result";
import { UnitTestDatabase } from "../data/unit-test-database";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { GearItem } from "../../src/features/gear/gear-item";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { SortState } from "../../src/lib/sorting/sort-state";

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

    it("FilterGearListFeature by invalid category returns the original list", () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
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

    it('FilterGearListFeature by "All" category returns a list of all gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
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

    it('FilterGearListFeature by "Armor" category returns a list of all armor gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
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

    it('FilterGearListFeature by "Equipment" category returns a list of all equipment gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
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

    it('FilterGearListFeature by "Weapon" category returns a list of all weapon gear list items', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
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

    it("FilterGearListFeature when exception occurs returns a failure result with error information", () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.category = GearItem.gearCategory;

        jest.spyOn(feature as any, "isValidGearCategory").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.value).not.toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe(ErrorCode.QueryError);
    });

    it("FilterGearListFeature by empty item name returns a list of all gear list items", () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.category = GearItem.gearCategory;
        request.search = "";

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

    it('FilterGearListFeature by "ba" item name returns gear list items with names that have "ba" in them', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.category = GearItem.gearCategory;
        request.search = "ba";
        const searchRegEx = new RegExp(`^.*(${request.search})+.*$`);

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        gear.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it('FilterGearListFeature by "Armor" category AND by "ba" item name returns armor gear list items with names that have "ba" in them', () => {
        // Arrange
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);
        const feature = new FilterGearListFeature(unitOfWork);
        const request = new FilterGearListRequest();
        request.category = ArmorItem.gearCategory;
        request.search = "ba";
        const searchRegEx = new RegExp(`^.*(${request.search})+.*$`);

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(2);

        const gear = result.value ?? [];

        gear.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it("SortGearListFeature by no field returns gear list items in same order as before", () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();

        const feature = new SortGearListFeature();
        const request = new SortGearListRequest();
        request.gearLisItems = filteredGearItems;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].id).toBe(filteredGearItems[i].id);
        }
    });

    it('SortGearListFeature by item name in "None" direction returns gear list items sorted by id from lowest to highest', () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set("Item");
        sortState.set("Item");
        sortState.set("Item");
        const firstElement = filteredGearItems.shift();
        if (firstElement) filteredGearItems.push(firstElement);
        const feature = new SortGearListFeature();
        const request = new SortGearListRequest();
        request.gearLisItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].id).toBe(i + 1);
        }
    });

    it('SortGearListFeature by item name in "Ascending" direction returns gear list items sorted by item name in alphabetical order', () => {
        // Arrange
        const expectedItemNameOrder: string[] = [
            "Advanced Battle Dress",
            "Hazard Suit",
            "Standard Battle Dress",
            "Standard Crew Attire",
            "Vaccsuit",
        ];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set("Item");

        const feature = new SortGearListFeature();
        const request = new SortGearListRequest();
        request.gearLisItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].name).toBe(expectedItemNameOrder[i]);
        }
    });

    it('SortGearListFeature by item name in "Descending" direction returns gear list items sorted by item name in reverse alphabetical order', () => {
        // Arrange
        const expectedItemNameOrder: string[] = [
            "Vaccsuit",
            "Standard Crew Attire",
            "Standard Battle Dress",
            "Hazard Suit",
            "Advanced Battle Dress",
        ];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set("Item");
        sortState.set("Item");

        const feature = new SortGearListFeature();
        const request = new SortGearListRequest();
        request.gearLisItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].name).toBe(expectedItemNameOrder[i]);
        }
    });

    it('SortGearListFeature by item cost in "Ascending" direction returns gear list items sorted by lowest to highest cost', () => {
        // Arrange
        const expectedItemNameOrder: number[] = [100, 2000, 4000, 10000, 12000];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set("Cost");

        const feature = new SortGearListFeature();
        const request = new SortGearListRequest();
        request.gearLisItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].cost).toBe(expectedItemNameOrder[i]);
        }
    });

    it('SortGearListFeature by item cost in "Descending" direction returns gear list items sorted by highest to lowest cost', () => {
        // Arrange
        const expectedItemNameOrder: number[] = [12000, 10000, 4000, 2000, 100];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set("Cost");
        sortState.set("Cost");

        const feature = new SortGearListFeature();
        const request = new SortGearListRequest();
        request.gearLisItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].cost).toBe(expectedItemNameOrder[i]);
        }
    });

    // it('SortGearListFeature by item category in "Ascending" direction returns gear list items sorted by item category in alphabetical order', () => {
    //     // Arrange
    //     const expectedItemNameOrder: number[] = [100, 2000, 4000, 10000, 12000];
    //     const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
    //     const sortState = new SortState();
    //     sortState.set("Category");

    //     const feature = new SortGearListFeature();
    //     const request = new SortGearListRequest();
    //     request.gearLisItems = filteredGearItems;
    //     request.sortState = sortState;

    //     // Act
    //     const result: Result<GearListItem[]> = feature.handle(request);

    //     // Assert
    //     expect(result.isSuccess).toBe(true);
    //     expect(result.value).toBeDefined();
    //     expect(result.value?.length).toBe(5);

    //     const gear = result.value ?? [];

    //     for (let i = 0; i < gear.length; i++) {
    //         expect(gear[i].cost).toBe(expectedItemNameOrder[i]);
    //     }
    // });

    function getGearItemByName(gear: GearListItem[], name: string): GearListItem {
        const foundItem = gear.find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new GearListItem(0, "", "", 0, "");
    }

    function getAllArmorGearListItems() {
        const filterFeature = getFilterGearListFeature();
        const filterRequest = new FilterGearListRequest();

        filterRequest.category = ArmorItem.gearCategory;

        return filterFeature.handle(filterRequest).value ?? [];
    }

    function getFilterGearListFeature() {
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);

        return new FilterGearListFeature(unitOfWork);
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
