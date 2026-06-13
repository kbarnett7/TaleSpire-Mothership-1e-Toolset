import { SortPlayerCharactersListFeature } from "../../src/features/player-characters/sort-player-characters-list/sort-player-characters-list-feature";
import { SortPlayerCharactersListRequest } from "../../src/features/player-characters/sort-player-characters-list/sort-player-characters-list-request";
import { PlayerCharacterListItem } from "../../src/features/player-characters/player-character-list-item";
import { Result } from "../../src/lib/result/result";
import { SortState } from "../../src/lib/sorting/sort-state";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { GetAllPlayerCharactersFeature } from "../../src/features/player-characters/get-all-player-characters/get-all-player-characters-feature";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { ErrorCode } from "../../src/lib/errors/error-code";

describe("SortPlayerCharactersListFeature", () => {
    let feature: SortPlayerCharactersListFeature;
    let request: SortPlayerCharactersListRequest;
    let allPlayerCharacters: PlayerCharacterListItem[];

    beforeEach(async () => {
        feature = new SortPlayerCharactersListFeature();
        request = new SortPlayerCharactersListRequest();
        allPlayerCharacters = await getAllPlayerCharacterListItems();
    });

    it("When exception occurs returns a failure result with error information", () => {
        // Arrange
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = new SortState(SortPlayerCharactersListFeature.fieldName);

        jest.spyOn(request.sortState, "direction", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.value).not.toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe(ErrorCode.QueryError);
        expect(result.error.description).toContain("Mocked exception");
    });

    it("By no field returns PC list items in same order as before", async () => {
        // Arrange
        request.playerCharacterListItems = allPlayerCharacters;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 0; i < sortedPlayerCharacters.length; i++) {
            expect(sortedPlayerCharacters[i].id).toBe(allPlayerCharacters[i].id);
        }
    });

    it("Returns the original list when field is invalid", () => {
        // Arrange
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = new SortState("invalid-field");

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 0; i < sortedPlayerCharacters.length; i++) {
            expect(sortedPlayerCharacters[i].id).toBe(allPlayerCharacters[i].id);
        }
    });

    it('By any field in "None" direction returns PC list items sorted by id from lowest to highest', () => {
        // Arrange
        const firstElement = allPlayerCharacters.shift();
        if (firstElement) allPlayerCharacters.push(firstElement);

        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = new SortState(SortPlayerCharactersListFeature.fieldName);

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 1; i < sortedPlayerCharacters.length; i++) {
            expect(sortedPlayerCharacters[i].id).toBeGreaterThanOrEqual(sortedPlayerCharacters[i - 1].id);
        }
    });

    it('By id in "Ascending" direction returns PC list items sorted by id from lowest to highest', async () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldId);
        const firstElement = allPlayerCharacters.shift();
        if (firstElement) allPlayerCharacters.push(firstElement);

        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 1; i < sortedPlayerCharacters.length; i++) {
            expect(sortedPlayerCharacters[i].id).toBeGreaterThanOrEqual(sortedPlayerCharacters[i - 1].id);
        }
    });

    it('By id in "Descending" direction returns PC list items sorted by id from highest to lowest', async () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldId);
        sortState.set(SortPlayerCharactersListFeature.fieldId);
        const firstElement = allPlayerCharacters.shift();
        if (firstElement) allPlayerCharacters.push(firstElement);

        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 1; i < sortedPlayerCharacters.length; i++) {
            expect(sortedPlayerCharacters[i].id).toBeLessThanOrEqual(sortedPlayerCharacters[i - 1].id);
        }
    });

    it('By name in "Ascending" direction returns PC list items sorted by name in alphabetical order', () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldName);
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 1; i < sortedPlayerCharacters.length; i++) {
            expect(
                sortedPlayerCharacters[i].name.toLowerCase() >= sortedPlayerCharacters[i - 1].name.toLowerCase(),
            ).toBe(true);
        }
    });

    it('By name in "Descending" direction returns PC list items sorted by name in reverse alphabetical order', () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldName);
        sortState.set(SortPlayerCharactersListFeature.fieldName); // second click = descending
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 1; i < sortedPlayerCharacters.length; i++) {
            expect(
                sortedPlayerCharacters[i].name.toLowerCase() <= sortedPlayerCharacters[i - 1].name.toLowerCase(),
            ).toBe(true);
        }
    });

    it('By class in "Ascending" direction returns PC list items sorted by name in alphabetical order', () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldClass);
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 1; i < sortedPlayerCharacters.length; i++) {
            expect(
                sortedPlayerCharacters[i].characterClass.toLowerCase() >=
                    sortedPlayerCharacters[i - 1].characterClass.toLowerCase(),
            ).toBe(true);
        }
    });

    it('By class in "Descending" direction returns PC list items sorted by name in reverse alphabetical order', () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldClass);
        sortState.set(SortPlayerCharactersListFeature.fieldClass); // second click = descending
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(allPlayerCharacters.length);

        const sortedPlayerCharacters = result.value ?? [];

        for (let i = 1; i < sortedPlayerCharacters.length; i++) {
            expect(
                sortedPlayerCharacters[i].characterClass.toLowerCase() <=
                    sortedPlayerCharacters[i - 1].characterClass.toLowerCase(),
            ).toBe(true);
        }
    });

    async function getAllPlayerCharacterListItems(): Promise<PlayerCharacterListItem[]> {
        const filterFeature = await getAllPlayerCharactersFeature();

        return filterFeature.handle(new EmptyRequest()) ?? [];
    }

    async function getAllPlayerCharactersFeature(): Promise<GetAllPlayerCharactersFeature> {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);

        return new GetAllPlayerCharactersFeature(unitOfWork);
    }
});
