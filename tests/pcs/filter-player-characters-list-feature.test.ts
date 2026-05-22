import { FilterPlayerCharactersListFeature } from "../../src/features/player-characters/filter-player-characters-list/filter-player-characters-list-feature";
import { FilterPlayerCharactersListRequest } from "../../src/features/player-characters/filter-player-characters-list/filter-player-characters-list-request";
import { PlayerCharacterListItem } from "../../src/features/player-characters/player-character-list-item";
import { Result } from "../../src/lib/result/result";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { GetAllPlayerCharactersFeature } from "../../src/features/player-characters/get-all-player-characters/get-all-player-characters-feature";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";

describe("FilterPlayerCharactersListFeature", () => {
    let unitOfWork: UnitOfWork;
    let feature: FilterPlayerCharactersListFeature;
    let request: FilterPlayerCharactersListRequest;
    let originalNumberOfPcsInDatabase: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);
        feature = new FilterPlayerCharactersListFeature(unitOfWork);
        request = new FilterPlayerCharactersListRequest();

        const getAllFeature = new GetAllPlayerCharactersFeature(unitOfWork);
        originalNumberOfPcsInDatabase = getAllFeature.handle(new EmptyRequest()).length;
    });

    it("Returns all player characters when search is empty and class is empty", () => {
        // Arrange
        request.search = "";
        request.characterClass = "";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(originalNumberOfPcsInDatabase);
    });

    it("Returns matching player characters when searching by name (case-insensitive)", () => {
        // Arrange
        request.search = "android";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBeGreaterThan(0);
        result.value?.forEach((pc) => {
            expect(pc.name.toLowerCase()).toMatch(/android/);
        });
    });

    it("Returns empty list when search matches no player characters", () => {
        // Arrange
        request.search = "zzznomatchzzz";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(0);
    });

    it("Escapes regex special characters in the search term", () => {
        // Arrange
        request.search = "test.android";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(0);
    });

    it("Returns all player characters when characterClass is empty", () => {
        // Arrange
        request.characterClass = "";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(originalNumberOfPcsInDatabase);
    });

    it("Returns only player characters of the specified class", () => {
        // Arrange
        request.characterClass = "Android";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBeGreaterThan(0);
        result.value?.forEach((pc) => {
            expect(pc.characterClass).toBe("Android");
        });
    });

    it("Returns empty list when characterClass does not match any player character", () => {
        // Arrange
        request.characterClass = "NonExistentClass";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(0);
    });

    it("Returns failure result when an exception is thrown", () => {
        // Arrange
        jest.spyOn(unitOfWork, "repo").mockImplementation(() => {
            throw new Error("Test error");
        });

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.error.description).toContain("Test error");
    });
});
