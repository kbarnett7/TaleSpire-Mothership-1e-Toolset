import { SortDirection } from "../src/lib/sorting/sort-direction";
import { SortState } from "../src/lib/sorting/sort-state";

describe("SortState", () => {
    it('Default has empty field and an direction of "None"', () => {
        // Arrange
        // Act
        const sortState = new SortState();

        // Assert
        expect(sortState.field).toBe("");
        expect(sortState.direction).toBe(SortDirection.None);
    });

    it('Constructor with field has default direction of "None"', () => {
        // Arrange
        // Act
        const sortState = new SortState("field");

        // Assert
        expect(sortState.field).toBe("field");
        expect(sortState.direction).toBe(SortDirection.None);
    });

    it("Setting field once sets the field and direction to be ascending.", () => {
        // Arrange
        const field = "field";
        const sortState = new SortState();

        // Act
        sortState.set(field);

        // Assert
        expect(sortState.field).toBe(field);
        expect(sortState.direction).toBe(SortDirection.Ascending);
    });

    it("Setting same field twice sets the field and direction to be descending.", () => {
        // Arrange
        const field = "field";
        const sortState = new SortState();

        // Act
        sortState.set(field);
        sortState.set(field);

        // Assert
        expect(sortState.field).toBe(field);
        expect(sortState.direction).toBe(SortDirection.Descending);
    });

    it("Setting same field three times sets the field to empty and direction to be none.", () => {
        // Arrange
        const field = "field";
        const sortState = new SortState();

        // Act
        sortState.set(field);
        sortState.set(field);
        sortState.set(field);

        // Assert
        expect(sortState.field).toBe(field);
        expect(sortState.direction).toBe(SortDirection.None);
    });

    it("Setting new field sets the state to the new field and direction to be ascending.", () => {
        // Arrange
        const fieldA = "fieldA";
        const fieldB = "fieldB";
        const sortState = new SortState();

        // Act
        sortState.set(fieldA);
        sortState.set(fieldB);

        // Assert
        expect(sortState.field).toBe(fieldB);
        expect(sortState.direction).toBe(SortDirection.Ascending);
    });
});
