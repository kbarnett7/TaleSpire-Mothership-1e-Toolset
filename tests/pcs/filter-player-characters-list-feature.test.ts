import { FilterPlayerCharactersListFeature } from "../../src/features/player-characters/filter-player-characters-list/filter-player-characters-list-feature";
import { FilterPlayerCharactersListRequest } from "../../src/features/player-characters/filter-player-characters-list/filter-player-characters-list-request";
import { PlayerCharacterListItem } from "../../src/features/player-characters/player-character-list-item";
import { Result } from "../../src/lib/result/result";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { GetAllPlayerCharactersFeature } from "../../src/features/player-characters/get-all-player-characters/get-all-player-characters-feature";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { ErrorCode } from "../../src/lib/errors/error-code";

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

    it("When exception occurs returns a failure result with error information", () => {
        // Arrange
        // Turn the search field into a get() property so that we can mock throwing an exception
        Object.defineProperty(request, "search", {
            get: jest.fn().mockImplementation(() => {
                throw new Error("Mocked exception");
            }),
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

    it("By empty name and class returns all player character list items", () => {
        // Arrange
        request.search = "";
        request.characterClassId = 0;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(originalNumberOfPcsInDatabase);
    });

    it("By empty name returns all player character list items", () => {
        // Arrange
        request.search = "";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(originalNumberOfPcsInDatabase);
    });

    it('By " " (empty space) name returns all player character list items', () => {
        // Arrange
        request.search = " ";

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(originalNumberOfPcsInDatabase);
    });

    it('By "st" name returns all player character list items with names that have "st" in them', () => {
        // Arrange
        request.search = "st";
        const searchRegEx = new RegExp(`^.*(${request.search})+.*$`);

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(3);

        const pcs = result.value ?? [];

        pcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it('By "ST" name returns all player character list items with names that have "st" in them (case-insensitive)', () => {
        // Arrange
        request.search = "ST";
        const searchRegEx = new RegExp(`^.*(${request.search.toLowerCase()})+.*$`);
        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(3);

        const pcs = result.value ?? [];

        pcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it('By " st" (empty space prefix) name returns all player character list items with names that have "st" in them', () => {
        // Arrange
        request.search = " st";
        const searchRegEx = new RegExp(`^.*(${request.search.trim().toLowerCase()})+.*$`);
        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(3);

        const pcs = result.value ?? [];

        pcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it('By "st " (empty space suffix) name returns all player character list items with names that have "st" in them', () => {
        // Arrange
        request.search = "st ";
        const searchRegEx = new RegExp(`^.*(${request.search.trim().toLowerCase()})+.*$`);
        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(3);

        const pcs = result.value ?? [];

        pcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it("By name with a regular expression character in it returns all player character list items with the regular expression character", () => {
        // Arrange
        request.search = "(";
        const searchRegEx = new RegExp(`^.*(${request.search.replace("(", "\\$&")})+.*$`);

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(1);

        const pcs = result.value ?? [];

        pcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it("When searching by name (case-insensitive) returns matching player characters", () => {
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

    it("When search matches no player characters returns empty list", () => {
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

    it("When characterClass is empty returns all player characters", () => {
        // Arrange
        request.characterClassId = 0;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(originalNumberOfPcsInDatabase);
    });

    it("When searching by class returns only player characters of the specified class", () => {
        // Arrange
        request.characterClassId = 2;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBeGreaterThan(0);
        result.value?.forEach((pc) => {
            expect(pc.characterClass).toBe("Android");
        });
    });

    it("When characterClass does not match any player character returns empty list", () => {
        // Arrange
        request.characterClassId = 999;

        // Act
        const result: Result<PlayerCharacterListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(0);
    });
});
