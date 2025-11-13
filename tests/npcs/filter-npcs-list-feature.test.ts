import { FilterNpcsListFeature } from "../../src/features/npcs/filter-npcs-list/filter-npcs-list-feature";
import { FilterNpcsListRequest } from "../../src/features/npcs/filter-npcs-list/filter-npcs-list-request";
import { GetAllNpcsFeature } from "../../src/features/npcs/get-all-npcs/get-all-npcs-feature";
import { NpcListItem } from "../../src/features/npcs/npc-list-item";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { Result } from "../../src/lib/result/result";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { NpcTestUtils } from "./npc-test-utils";

describe("FilterNpcsListFeature", () => {
    let unitOfWork: UnitOfWork;
    let feature: FilterNpcsListFeature;
    let request: FilterNpcsListRequest;
    let originalNumberOfNpcsInDatabase: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        setOriginalNumberOfGearItemsIdInDatabase();

        feature = new FilterNpcsListFeature(unitOfWork);
        request = new FilterNpcsListRequest();
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
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.value).not.toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe(ErrorCode.QueryError);
    });

    it("By empty name returns a list of all NPC list items", () => {
        // Arrange
        request.search = "";

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(originalNumberOfNpcsInDatabase);
    });

    it('By " " (empty space) name returns a list of all NPC list items', () => {
        // Arrange
        request.search = " ";

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(originalNumberOfNpcsInDatabase);
    });

    it('By "on" name returns NPC list items with names that have "on" in them', () => {
        // Arrange
        request.search = "on";
        const searchRegEx = new RegExp(`^.*(${request.search})+.*$`);

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(3);

        const npcs = result.value ?? [];

        npcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it('By "ON" name returns NPC list items with names that have "on" in them (case invariant)', () => {
        // Arrange
        request.search = "ON";
        const searchRegEx = new RegExp(`^.*(${request.search.toLowerCase()})+.*$`);

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(3);

        const npcs = result.value ?? [];

        npcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it('By " on" (empty space prefix) name returns NPC list items with names that have "on" in them', () => {
        // Arrange
        request.search = " on";
        const searchRegEx = new RegExp(`^.*(${request.search.trim()})+.*$`);

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(3);

        const npcs = result.value ?? [];

        npcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it('By "on " (empty space suffix) name returns NPC list items with names that have "on" in them', () => {
        // Arrange
        request.search = "on ";
        const searchRegEx = new RegExp(`^.*(${request.search.trim()})+.*$`);

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(3);

        const npcs = result.value ?? [];

        npcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it("By name with a regular expression character in it returns NPC list items with the regular expression character", () => {
        // Arrange
        request.search = "(";
        const searchRegEx = new RegExp(`^.*(${request.search.replace("(", "\\$&")})+.*$`);

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(1);

        const npcs = result.value ?? [];

        npcs.forEach((item) => {
            expect(item.name.toLowerCase()).toMatch(searchRegEx);
        });
    });

    it.each([1.2, -1, 4])("By invalid source returns the original list", (sourceId: number) => {
        // Arrange
        request.sourceId = sourceId;

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(originalNumberOfNpcsInDatabase);

        const npcs = result.value ?? [];
        let npc = NpcTestUtils.getNpcItemByName(npcs, "The 4YourEyez Algorithm");
        NpcTestUtils.expectNpcToBe(npc, 1, 3, "The 4YourEyez Algorithm");

        npc = NpcTestUtils.getNpcItemByName(npcs, "Belladonnas");
        NpcTestUtils.expectNpcToBe(npc, 3, 3, "Belladonnas");

        npc = NpcTestUtils.getNpcItemByName(npcs, "Custom NPC A");
        NpcTestUtils.expectNpcToBe(npc, 10, 1, "Custom NPC A");
    });

    function setOriginalNumberOfGearItemsIdInDatabase(): void {
        const feature = new GetAllNpcsFeature(unitOfWork);
        const npcs: NpcListItem[] = feature.handle(new EmptyRequest());

        originalNumberOfNpcsInDatabase = npcs.length;
    }
});
