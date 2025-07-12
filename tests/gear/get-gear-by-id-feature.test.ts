import { ArmorItem } from "../../src/features/gear/armor-item";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { GearItem } from "../../src/features/gear/gear-item";
import { GetGearByIdFeature } from "../../src/features/gear/get-gear-by-id/get-gear-by-id-feature";
import { GetGearByIdRequest } from "../../src/features/gear/get-gear-by-id/get-gear-by-id-request";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("GetGearByIdFeature", () => {
    let feature: GetGearByIdFeature;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);

        feature = new GetGearByIdFeature(unitOfWork);
    });

    it("With id of 1 and category of equipment returns the equipment gear item with an id of 1", () => {
        // Arrange
        const request = new GetGearByIdRequest(1, EquipmentItem.gearCategory);

        // Act
        const gearItem: EquipmentItem = feature.handle(request) as EquipmentItem;

        // Assert
        expect(gearItem.id).toBe(1);
        expect(gearItem.sourceId).toBe(2);
        expect(gearItem.name).toBe("Assorted Tools");
        expect(gearItem.cost).toBe(20);
    });

    it("With id of 1 and category of armor returns the armor gear item with an id of 1", () => {
        // Arrange
        const request = new GetGearByIdRequest(1, ArmorItem.gearCategory);

        // Act
        const gearItem: ArmorItem = feature.handle(request) as ArmorItem;

        // Assert
        expect(gearItem.id).toBe(1);
        expect(gearItem.sourceId).toBe(2);
        expect(gearItem.name).toBe("Standard Crew Attire");
        expect(gearItem.armorPoints).toBe(1);
    });

    it("With id of 1 and category of weapon returns the weapon gear item with an id of 1", () => {
        // Arrange
        const request = new GetGearByIdRequest(1, WeaponItem.gearCategory);

        // Act
        const gearItem: WeaponItem = feature.handle(request) as WeaponItem;

        // Assert
        expect(gearItem.id).toBe(1);
        expect(gearItem.sourceId).toBe(2);
        expect(gearItem.name).toBe("Boarding Axe");
        expect(gearItem.damage).toBe("2d10");
    });

    it("With id of 1 and an invalid category returns an empty gear item with an id of 0", () => {
        // Arrange
        const request = new GetGearByIdRequest(1, "invalid-category");

        // Act
        const gearItem: GearItem = feature.handle(request);

        // Assert
        expect(gearItem.id).toBe(0);
        expect(gearItem.sourceId).toBe(0);
        expect(gearItem.name).toBe("");
    });

    it("With id of 2 and category of equipment returns the equipment gear item with an id of 2", () => {
        // Arrange
        const request = new GetGearByIdRequest(2, EquipmentItem.gearCategory);

        // Act
        const gearItem: EquipmentItem = feature.handle(request) as EquipmentItem;

        // Assert
        expect(gearItem.id).toBe(2);
        expect(gearItem.sourceId).toBe(2);
        expect(gearItem.name).toBe("Automed (x5)");
        expect(gearItem.cost).toBe(1500);
    });
});
