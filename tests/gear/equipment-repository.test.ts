import { EquipmentRepository } from "../../src/features/gear/equipment-repository";
import { EquipmentItem } from "../../src/features/gear/equipment-item";

describe("Equipment", () => {
    it("get all equipment", () => {
        // Arrange
        const repository = new EquipmentRepository();

        // Act
        const gear: EquipmentItem[] = repository.list();

        // Assert
        expect(gear.length).toBeGreaterThan(0);
    });
});
