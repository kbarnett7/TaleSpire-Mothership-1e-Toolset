import { GearItem } from "../../src/features/gear/gear-item";
import { GearRepository } from "../../src/features/gear/gear-repository";

describe("Gear", () => {
    it("get all gear returns all gear list items", () => {
        // Arrange
        const repository = new GearRepository();
        
        // Act
        const gear: GearItem[] = repository.list();

        // Assert
        expect(gear.length).toBeGreaterThan(0);
    });
});