import { SortPlayerCharactersListFeature } from "../../src/features/player-characters/sort-player-characters-list/sort-player-characters-list-feature";
import { SortPlayerCharactersListRequest } from "../../src/features/player-characters/sort-player-characters-list/sort-player-characters-list-request";
import { PlayerCharacterListItem } from "../../src/features/player-characters/player-character-list-item";
import { Result } from "../../src/lib/result/result";
import { SortState } from "../../src/lib/sorting/sort-state";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { GetAllPlayerCharactersFeature } from "../../src/features/player-characters/get-all-player-characters/get-all-player-characters-feature";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";

describe("SortPlayerCharactersListFeature", () => {
    let feature: SortPlayerCharactersListFeature;
    let request: SortPlayerCharactersListRequest;
    let allPlayerCharacters: PlayerCharacterListItem[];

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);
        feature = new SortPlayerCharactersListFeature();
        request = new SortPlayerCharactersListRequest();

        const getAllFeature = new GetAllPlayerCharactersFeature(unitOfWork);
        allPlayerCharacters = getAllFeature.handle(new EmptyRequest());
    });

    it("Returns the original list when field is invalid", () => {
        // Arrange
        const sortState = new SortState("invalid-field");
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toEqual(allPlayerCharacters);
    });

    it("Sorts by id when SortDirection is None", () => {
        // Arrange
        const sortState = new SortState(SortPlayerCharactersListFeature.fieldName);
        // Reset to None by not setting (default is None before first click)
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = new SortState();

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        const pcs = result.value ?? [];
        for (let i = 1; i < pcs.length; i++) {
            expect(pcs[i].id).toBeGreaterThanOrEqual(pcs[i - 1].id);
        }
    });

    it("Sorts by name in Ascending order", () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldName);
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        const pcs = result.value ?? [];
        for (let i = 1; i < pcs.length; i++) {
            expect(pcs[i].name.toLowerCase() >= pcs[i - 1].name.toLowerCase()).toBe(true);
        }
    });

    it("Sorts by name in Descending order", () => {
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
        const pcs = result.value ?? [];
        for (let i = 1; i < pcs.length; i++) {
            expect(pcs[i].name.toLowerCase() <= pcs[i - 1].name.toLowerCase()).toBe(true);
        }
    });

    it("Sorts by class in Ascending order", () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldClass);
        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        const pcs = result.value ?? [];
        for (let i = 1; i < pcs.length; i++) {
            expect(pcs[i].characterClass.toLowerCase() >= pcs[i - 1].characterClass.toLowerCase()).toBe(true);
        }
    });

    it("Sorts by class in Descending order", () => {
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
        const pcs = result.value ?? [];
        for (let i = 1; i < pcs.length; i++) {
            expect(pcs[i].characterClass.toLowerCase() <= pcs[i - 1].characterClass.toLowerCase()).toBe(true);
        }
    });

    it("Returns failure result when an exception is thrown during sort", () => {
        // Arrange
        const sortState = new SortState();
        sortState.set(SortPlayerCharactersListFeature.fieldName);

        jest.spyOn(sortState, "direction", "get").mockImplementation(() => {
            throw new Error("Test sort error");
        });

        request.playerCharacterListItems = allPlayerCharacters;
        request.sortState = sortState;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.error.description).toContain("Test sort error");
    });
});
