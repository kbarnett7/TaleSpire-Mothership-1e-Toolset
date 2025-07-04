import { NpcListItem } from "../../src/features/npcs/npc-list-item";
import { GetAllNpcsFeature } from "../../src/features/npcs/get-all-npcs/get-all-npcs-feature";
import { SortNpcsListFeature } from "../../src/features/npcs/sort-npcs-list/sort-npcs-list-feature";
import { SortNpcsListRequest } from "../../src/features/npcs/sort-npcs-list/sort-npcs-list-request";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { Result } from "../../src/lib/result/result";
import { SortState } from "../../src/lib/sorting/sort-state";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("SortNpcsListFeature", () => {
    const npcNamesInAlphabeticalOrder: string[] = [
        "Angels",
        "Belladonnas",
        "C-Levels",
        "Cabin 102-B",
        "Chronopods",
        "Demons",
        "The 4YourEyez Algorithm",
        "The Body Politic",
        "The Brown Stream (video)",
    ];
    let feature: SortNpcsListFeature;
    let request: SortNpcsListRequest;

    beforeEach(() => {
        feature = new SortNpcsListFeature();
        request = new SortNpcsListRequest();
    });

    it("When exception occurs returns a failure result with error information", () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        request.npcListItems = [...filteredNpcs];
        request.sortState = new SortState(SortNpcsListFeature.fieldId);

        jest.spyOn(request.sortState, "direction", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.value).not.toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe(ErrorCode.QueryError);
    });

    it("By no field returns NPC list items in same order as before", () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        request.npcListItems = [...filteredNpcs];

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            expect(npcs[i].id).toBe(filteredNpcs[i].id);
        }
    });

    it("By invalid field returns NPC list items in same order as before", () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const firstElement = filteredNpcs.shift();
        if (firstElement) filteredNpcs.push(firstElement);

        request.npcListItems = [...filteredNpcs];
        request.sortState = new SortState("invalid_field");

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            expect(npcs[i].id).toBe(filteredNpcs[i].id);
        }
    });

    it('By any field in "None" direction returns NPC list items sorted by id from lowest to highest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState(SortNpcsListFeature.fieldName);
        const firstElement = filteredNpcs.shift();
        if (firstElement) filteredNpcs.push(firstElement);

        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            expect(npcs[i].id).toBe(i + 1);
        }
    });

    it('By id in "Ascending" direction returns NPC list items sorted by id from lowest to highest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldId);
        const firstElement = filteredNpcs.shift();
        if (firstElement) filteredNpcs.push(firstElement);

        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].id).toBeGreaterThanOrEqual(npcs[i - 1].id);
            }
        }
    });

    it('By id in "Descending" direction returns NPC list items sorted by id from highest to lowest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldId);
        sortState.set(SortNpcsListFeature.fieldId);
        const firstElement = filteredNpcs.shift();
        if (firstElement) filteredNpcs.push(firstElement);

        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].id).toBeLessThanOrEqual(npcs[i - 1].id);
            }
        }
    });

    it('By name in "Ascending" direction returns NPC list items sorted by name in alphabetical order', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldName);

        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            expect(npcs[i].name).toBe(npcNamesInAlphabeticalOrder[i]);
        }
    });

    it('By name in "Descending" direction returns NPCs list items sorted by name in reverse alphabetical order', () => {
        // Arrange
        const expectedNameOrder: string[] = [...npcNamesInAlphabeticalOrder].reverse();
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldName);
        sortState.set(SortNpcsListFeature.fieldName);

        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            expect(npcs[i].name).toBe(expectedNameOrder[i]);
        }
    });

    it('By combat in "Ascending" direction returns NPC list items sorted by combat from lowest to highest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldCombat);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].combat).toBeGreaterThanOrEqual(npcs[i - 1].combat);
            }
        }
    });

    it('By combat in "Descending" direction returns NPC list items sorted by combat from highest to lowest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldCombat);
        sortState.set(SortNpcsListFeature.fieldCombat);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].combat).toBeLessThanOrEqual(npcs[i - 1].combat);
            }
        }
    });

    it('By instinct in "Ascending" direction returns NPC list items sorted by instinct from lowest to highest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldInstinct);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].instinct).toBeGreaterThanOrEqual(npcs[i - 1].instinct);
            }
        }
    });

    it('By instinct in "Descending" direction returns NPC list items sorted by instinct from highest to lowest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldInstinct);
        sortState.set(SortNpcsListFeature.fieldInstinct);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].instinct).toBeLessThanOrEqual(npcs[i - 1].instinct);
            }
        }
    });

    it('By armor points in "Ascending" direction returns NPC list items sorted by armor points from lowest to highest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldArmorPoints);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].armorPoints).toBeGreaterThanOrEqual(npcs[i - 1].armorPoints);
            }
        }
    });

    it('By armor points in "Descending" direction returns NPC list items sorted by armor points from highest to lowest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldArmorPoints);
        sortState.set(SortNpcsListFeature.fieldArmorPoints);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].armorPoints).toBeLessThanOrEqual(npcs[i - 1].armorPoints);
            }
        }
    });

    it('By health in "Ascending" direction returns NPC list items sorted by health from lowest to highest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldWoundsHealth);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].health).toBeGreaterThanOrEqual(npcs[i - 1].health);
            }
        }
    });

    it('By health in "Descending" direction returns NPC list items sorted by health from highest to lowest', () => {
        // Arrange
        const filteredNpcs: NpcListItem[] = getAllNpcListItems();
        const sortState = new SortState();
        sortState.set(SortNpcsListFeature.fieldWoundsHealth);
        sortState.set(SortNpcsListFeature.fieldWoundsHealth);
        request.npcListItems = filteredNpcs;
        request.sortState = sortState;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);

        const npcs = result.value ?? [];

        for (let i = 0; i < npcs.length; i++) {
            if (i > 0) {
                expect(npcs[i].health).toBeLessThanOrEqual(npcs[i - 1].health);
            }
        }
    });

    function getAllNpcListItems(): NpcListItem[] {
        const filterFeature = getAllNpcsFeature();

        return filterFeature.handle(new EmptyRequest()) ?? [];
    }

    function getAllNpcsFeature(): GetAllNpcsFeature {
        const jsonDatabaseFilePath = "./tests/data/json/database.json";
        const dbContext = DataAccessUtils.getInitializedDbContext(jsonDatabaseFilePath);
        const unitOfWork = new UnitOfWork(dbContext);

        return new GetAllNpcsFeature(unitOfWork);
    }
});
