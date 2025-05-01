import { IGearItem, IEquipmentItem } from "../../src/database/gear-item-interface";
import { GearItem } from "../../src/features/gear/gear-item";
import { GearRepository } from "../../src/features/gear/gear-repository";
import equipment from "../../src/database/equipment.json";

describe("Gear", () => {
    it("get all gear returns all gear list items", () => {
        // Arrange
        const repository = new GearRepository();
        
        // Act
        const gear: GearItem[] = repository.list();

        // Assert
        expect(gear.length).toBeGreaterThan(0);
    });

    it("temp", () => {
        const data: IGearItem[] = equipment;

        //console.log(data);
        console.log(data[0].name);
    });
});