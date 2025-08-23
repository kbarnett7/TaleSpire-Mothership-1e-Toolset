import { WeaponCategory } from "../../src/features/gear/weapon-category";
import { WeaponItemFormFieldsDto } from "../../src/features/gear/weapon-item-form-fields-dto";
import { WeaponRange } from "../../src/features/gear/weapon-range";

describe("WeaponItemFormFieldsDto", () => {
    it("should be createable from a constructor", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedCategory = WeaponCategory.Firearm;
        const expectedRange = WeaponRange.Long;
        const expectedDamage = "1d10";
        const expectedShots = "3";
        const expectedWound = "Gunshot";
        const expectedSpecial = "Test special";

        const dto = new WeaponItemFormFieldsDto(
            expectedName,
            expectedDescription,
            expectedCost,
            expectedCategory,
            expectedRange,
            expectedDamage,
            expectedShots,
            expectedWound,
            expectedSpecial
        );

        expect(dto.name).toBe(expectedName);
        expect(dto.description).toBe(expectedDescription);
        expect(dto.cost).toBe(expectedCost);
        expect(dto.category).toBe(expectedCategory);
        expect(dto.range).toBe(expectedRange);
        expect(dto.damage).toBe(expectedDamage);
        expect(dto.shots).toBe(expectedShots);
        expect(dto.wound).toBe(expectedWound);
        expect(dto.special).toBe(expectedSpecial);
    });

    it("should be createable from a JSON string", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedCategory = WeaponCategory.Firearm;
        const expectedRange = WeaponRange.Long;
        const expectedDamage = "1d10";
        const expectedShots = "3";
        const expectedWound = "Gunshot";
        const expectedSpecial = "Test special";
        const weaponItemJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
            cost: expectedCost,
            category: expectedCategory,
            range: expectedRange,
            damage: expectedDamage,
            shots: expectedShots,
            wound: expectedWound,
            special: expectedSpecial,
        });

        const dto = WeaponItemFormFieldsDto.createFromJson(weaponItemJsonString);

        expect(dto.name).toBe(expectedName);
        expect(dto.description).toBe(expectedDescription);
        expect(dto.cost).toBe(expectedCost);
        expect(dto.category).toBe(expectedCategory);
        expect(dto.range).toBe(expectedRange);
        expect(dto.damage).toBe(expectedDamage);
        expect(dto.shots).toBe(expectedShots);
        expect(dto.wound).toBe(expectedWound);
        expect(dto.special).toBe(expectedSpecial);
    });

    it("should be exportable to a JSON string", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedCategory = WeaponCategory.Firearm;
        const expectedRange = WeaponRange.Long;
        const expectedDamage = "1d10";
        const expectedShots = "3";
        const expectedWound = "Gunshot";
        const expectedSpecial = "Test special";
        const expectedJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
            cost: expectedCost,
            category: expectedCategory,
            range: expectedRange,
            damage: expectedDamage,
            shots: expectedShots,
            wound: expectedWound,
            special: expectedSpecial,
        });
        const dto = new WeaponItemFormFieldsDto(
            expectedName,
            expectedDescription,
            expectedCost,
            expectedCategory,
            expectedRange,
            expectedDamage,
            expectedShots,
            expectedWound,
            expectedSpecial
        );

        const result = dto.toJson();

        expect(result).toBe(expectedJsonString);
    });
});
