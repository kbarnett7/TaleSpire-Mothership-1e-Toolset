import { FilterNpcsListFeature } from "../../src/features/npcs/filter-npcs-list/filter-npcs-list-feature";
import { FilterNpcsListRequest } from "../../src/features/npcs/filter-npcs-list/filter-npcs-list-request";
import { NpcListItem } from "../../src/features/npcs/npc-list-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { Result } from "../../src/lib/result/result";
import { UnitTestDatabase } from "../data/unit-test-database";

describe("FilterNpcsListFeature", () => {
    let feature: FilterNpcsListFeature;
    let request: FilterNpcsListRequest;

    beforeEach(() => {
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);

        feature = new FilterNpcsListFeature(unitOfWork);
        request = new FilterNpcsListRequest();
    });

    it("By empty name returns a list of all NPC list items", () => {
        // Arrange
        request.search = "";

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);
    });

    it('By " " (empty space) name returns a list of all NPC list items', () => {
        // Arrange
        request.search = " ";

        // Act
        const result: Result<NpcListItem[]> = feature.handle(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value?.length).toBe(9);
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
});
