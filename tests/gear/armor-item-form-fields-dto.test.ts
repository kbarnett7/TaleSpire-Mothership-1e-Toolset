import { ArmorItemFormFieldsDto } from "../../src/features/gear/armor-item-form-fields-dto";
import { JsonService } from "../../src/lib/services/json-service";

describe("ArmorItemFormFieldsDto", () => {
    it("should be createable from a JSON string", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedArmorPoints = "2";
        const expectedOxygen = "5";
        const expectedSpeed = "[+]";
        const expectedSpecial = "Test special";
        const equipmentItemJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
            cost: expectedCost,
        });

        const armorItemJsonString = JSON.stringify({
            armorPoints: expectedArmorPoints,
            oxygen: expectedOxygen,
            speed: expectedSpeed,
            special: expectedSpecial,
        });

        console.log(equipmentItemJsonString);
        console.log(armorItemJsonString);

        const combinedJson = JsonService.instance.concat([equipmentItemJsonString, armorItemJsonString]);

        const dto = ArmorItemFormFieldsDto.createFromJson(combinedJson);

        expect(dto.name).toBe(expectedName);
        expect(dto.description).toBe(expectedDescription);
        expect(dto.cost).toBe(expectedCost);
        expect(dto.armorPoints).toBe(expectedArmorPoints);
        expect(dto.oxygen).toBe(expectedOxygen);
        expect(dto.speed).toBe(expectedSpeed);
        expect(dto.special).toBe(expectedSpecial);
    });
});
