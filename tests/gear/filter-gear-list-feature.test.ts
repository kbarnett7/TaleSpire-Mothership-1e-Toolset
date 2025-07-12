import { FilterGearListFeature } from "../../src/features/gear/filter-gear-list/filter-gear-list-feature";
import { FilterGearListRequest } from "../../src/features/gear/filter-gear-list/filter-gear-list-request";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { GearListItem } from "../../src/features/gear/gear-list-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { Result } from "../../src/lib/result/result";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { GearItem } from "../../src/features/gear/gear-item";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { GearTestUtils } from "./gear-test-utils";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("FilterGearListFeature", () => {
    let feature: FilterGearListFeature;
    let request: FilterGearListRequest;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);

        feature = new FilterGearListFeature(unitOfWork);
        request = new FilterGearListRequest();
    });

    it("When exception occurs returns a failure result with error information", () => {
        // Arrange
        request.category = GearItem.gearCategory;

        // Turn the category field into a get() property so that we can mock throwing an exception
        Object.defineProperty(request, "category", {
            get: jest.fn().mockImplementation(() => {
                throw new Error("Mocked exception");
            }),
        });

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.value).not.toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe(ErrorCode.QueryError);
    });

    it("By invalid category returns the original list", () => {
        // Arrange
        request.category = "invalid-category";

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];
        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        GearTestUtils.expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        GearTestUtils.expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        GearTestUtils.expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it('By "All" category returns a list of all gear list items', () => {
        // Arrange
        request.category = GearItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];
        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        GearTestUtils.expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        GearTestUtils.expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        GearTestUtils.expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it('By "Armor" category returns a list of all armor gear list items', () => {
        // Arrange
        request.category = ArmorItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];
        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        expect(item.id).toBe(0);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        GearTestUtils.expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        expect(item.id).toBe(0);
    });

    it('By "Equipment" category returns a list of all equipment gear list items', () => {
        // Arrange
        request.category = EquipmentItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];
        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        GearTestUtils.expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        expect(item.id).toBe(0);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        expect(item.id).toBe(0);
    });

    it('By "Weapon" category returns a list of all weapon gear list items', () => {
        // Arrange
        request.category = WeaponItem.gearCategory;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];
        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        expect(item.id).toBe(0);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        expect(item.id).toBe(0);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        GearTestUtils.expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it("By empty item name returns a list of all gear list items", () => {
        // Arrange
        request.category = GearItem.gearCategory;
        request.search = "";

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];
        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        GearTestUtils.expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        GearTestUtils.expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        GearTestUtils.expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it('By " " (empty space) item name returns a list of all gear list items', () => {
        // Arrange
        request.category = GearItem.gearCategory;
        request.search = " ";

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];
        let item: GearListItem = GearTestUtils.getGearItemByName(gear, "Assorted Tools");
        GearTestUtils.expectItemToBe(item, 1, "Assorted Tools", 20, EquipmentItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Standard Crew Attire");
        GearTestUtils.expectItemToBe(item, 1, "Standard Crew Attire", 100, ArmorItem.gearCategory);

        item = GearTestUtils.getGearItemByName(gear, "Boarding Axe");
        GearTestUtils.expectItemToBe(item, 1, "Boarding Axe", 150, WeaponItem.gearCategory);
    });

    it('By "ba" item name returns gear list items with names that have "ba" in them', () => {
        // Arrange
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

    it('By "BA" item name returns gear list items with names that have "ba" in them (case invariant)', () => {
        // Arrange
        request.category = GearItem.gearCategory;
        request.search = "BA";
        const searchRegEx = new RegExp(`^.*(${request.search.toLowerCase()})+.*$`);

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

    it('By " ba" (empty space prefix) item name returns gear list items with names that have "ba" in them', () => {
        // Arrange
        request.category = GearItem.gearCategory;
        request.search = " ba";
        const searchRegEx = new RegExp(`^.*(${request.search.trim()})+.*$`);

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

    it('By "ba " (empty space suffix) item name returns gear list items with names that have "ba" in them', () => {
        // Arrange
        request.category = GearItem.gearCategory;
        request.search = "ba ";
        const searchRegEx = new RegExp(`^.*(${request.search.trim()})+.*$`);

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

    it('By "Armor" category AND by "ba" item name returns armor gear list items with names that have "ba" in them', () => {
        // Arrange
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

    it("By item name with a regular expression character in it returns gear list items with the regular expression character", () => {
        // Arrange
        request.category = GearItem.gearCategory;
        request.search = "(";
        const searchRegEx = new RegExp(`^.*(${request.search.replace("(", "\\$&")})+.*$`);

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
});
