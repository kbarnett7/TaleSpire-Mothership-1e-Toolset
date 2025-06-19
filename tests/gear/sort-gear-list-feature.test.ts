import { GetAllGearFeature } from "../../src/features/gear/get-all-gear/get-all-gear-feature";
import { FilterGearListFeature } from "../../src/features/gear/filter-gear-list/filter-gear-list-feature";
import { FilterGearListRequest } from "../../src/features/gear/filter-gear-list/filter-gear-list-request";
import { SortGearListFeature } from "../../src/features/gear/sort-gear-list/sort-gear-list-feature";
import { SortGearListRequest } from "../../src/features/gear/sort-gear-list/sort-gear-list-request";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { GearListItem } from "../../src/features/gear/gear-list-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { Result } from "../../src/lib/result/result";
import { UnitTestDatabase } from "../data/unit-test-database";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { SortState } from "../../src/lib/sorting/sort-state";

describe("SortGearListFeature", () => {
    const armorItemNameInAlphabeticalOrder: string[] = [
        "Advanced Battle Dress",
        "Hazard Suit",
        "Standard Battle Dress",
        "Standard Crew Attire",
        "Vaccsuit",
    ];

    let feature: SortGearListFeature;
    let request: SortGearListRequest;

    beforeEach(() => {
        feature = new SortGearListFeature();
        request = new SortGearListRequest();
    });

    it("When exception occurs returns a failure result with error information", () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllGearListItems();
        request.gearListItems = [...filteredGearItems];
        request.sortState = new SortState(SortGearListFeature.fieldId);

        jest.spyOn(feature as any, "sortGearListItems").mockImplementation(() => {
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

    it("By no field returns gear list items in same order as before", () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllGearListItems();
        request.gearListItems = [...filteredGearItems];

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].id).toBe(filteredGearItems[i].id);
        }
    });

    it("By invalid field returns gear list items in same order as before", () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllGearListItems();
        const firstElement = filteredGearItems.shift();
        if (firstElement) filteredGearItems.push(firstElement);

        request.gearListItems = [...filteredGearItems];
        request.sortState = new SortState("invalid_field");

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].id).toBe(filteredGearItems[i].id);
        }
    });

    it('By any field in "None" direction returns gear list items sorted by id from lowest to highest', () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState(SortGearListFeature.fieldItem);
        const firstElement = filteredGearItems.shift();
        if (firstElement) filteredGearItems.push(firstElement);

        request.gearListItems = filteredGearItems;
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

    it('By item id in "Ascending" direction returns gear list items sorted by id from lowest to highest', () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldId);
        const firstElement = filteredGearItems.shift();
        if (firstElement) filteredGearItems.push(firstElement);

        request.gearListItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            if (i > 0) {
                expect(gear[i].id).toBeGreaterThanOrEqual(gear[i - 1].id);
            }
        }
    });

    it('By item id in "Descending" direction returns gear list items sorted by id from highest to lowest', () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldId);
        sortState.set(SortGearListFeature.fieldId);
        const firstElement = filteredGearItems.shift();
        if (firstElement) filteredGearItems.push(firstElement);

        request.gearListItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            if (i > 0) {
                expect(gear[i].id).toBeLessThanOrEqual(gear[i - 1].id);
            }
        }
    });

    it('By item name in "Ascending" direction returns gear list items sorted by item name in alphabetical order', () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldItem);

        request.gearListItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(5);

        const gear = result.value ?? [];

        for (let i = 0; i < gear.length; i++) {
            expect(gear[i].name).toBe(armorItemNameInAlphabeticalOrder[i]);
        }
    });

    it('By item name in "Descending" direction returns gear list items sorted by item name in reverse alphabetical order', () => {
        // Arrange
        const expectedItemNameOrder: string[] = [...armorItemNameInAlphabeticalOrder].reverse();
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldItem);
        sortState.set(SortGearListFeature.fieldItem);

        request.gearListItems = filteredGearItems;
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

    it('By item cost in "Ascending" direction returns gear list items sorted by lowest to highest cost', () => {
        // Arrange
        const expectedItemNameOrder: number[] = [100, 2000, 4000, 10000, 12000];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldCost);

        request.gearListItems = filteredGearItems;
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

    it('By item cost in "Descending" direction returns gear list items sorted by highest to lowest cost', () => {
        // Arrange
        const expectedItemNameOrder: number[] = [12000, 10000, 4000, 2000, 100];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldCost);
        sortState.set(SortGearListFeature.fieldCost);

        request.gearListItems = filteredGearItems;
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

    it('By item category in "Ascending" direction returns gear list items sorted by item category in alphabetical order', () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldCategory);

        request.gearListItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];

        expect(gear[0].category).toBe("Armor");
        expect(gear[5].category).toBe("Equipment");
        expect(gear[10].category).toBe("Weapon");
    });

    it('By item category in "Descending" direction returns gear list items sorted by item category in reverse alphabetical order', () => {
        // Arrange
        const filteredGearItems: GearListItem[] = getAllGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldCategory);
        sortState.set(SortGearListFeature.fieldCategory);

        request.gearListItems = filteredGearItems;
        request.sortState = sortState;

        // Act
        const result: Result<GearListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(15);

        const gear = result.value ?? [];

        expect(gear[0].category).toBe("Weapon");
        expect(gear[5].category).toBe("Equipment");
        expect(gear[10].category).toBe("Armor");
    });

    it('By item description in "Ascending" direction returns gear list items sorted by item description in alphabetical order', () => {
        // Arrange
        const expectedItemNameOrder: string[] = [
            "Standard Crew Attire",
            "Vaccsuit",
            "Hazard Suit",
            "Advanced Battle Dress",
            "Standard Battle Dress",
        ];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldDescription);

        request.gearListItems = filteredGearItems;
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

    it('By item description in "Descending" direction returns gear list items sorted by item description in reverse alphabetical order', () => {
        // Arrange
        const expectedItemNameOrder: string[] = [
            "Standard Battle Dress",
            "Advanced Battle Dress",
            "Hazard Suit",
            "Vaccsuit",
            "Standard Crew Attire",
        ];
        const filteredGearItems: GearListItem[] = getAllArmorGearListItems();
        const sortState = new SortState();
        sortState.set(SortGearListFeature.fieldDescription);
        sortState.set(SortGearListFeature.fieldDescription);

        request.gearListItems = filteredGearItems;
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

    function getAllGearListItems(): GearListItem[] {
        const filterFeature = getAllGearListFeature();

        return filterFeature.handle(new EmptyRequest()) ?? [];
    }

    function getAllArmorGearListItems(): GearListItem[] {
        const filterFeature = getFilterGearListFeature();
        const filterRequest = new FilterGearListRequest();

        filterRequest.category = ArmorItem.gearCategory;

        return filterFeature.handle(filterRequest).value ?? [];
    }

    function getAllGearListFeature(): GetAllGearFeature {
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);

        return new GetAllGearFeature(unitOfWork);
    }

    function getFilterGearListFeature(): FilterGearListFeature {
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);

        return new FilterGearListFeature(unitOfWork);
    }
});
