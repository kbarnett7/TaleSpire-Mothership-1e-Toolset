import { ArmorItemFormFieldsDto } from "../../src/features/gear/armor-item-form-fields-dto";

describe("ArmorItemFormFieldsDto", () => {
    it("should be createable from a constructor", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedArmorPoints = "2";
        const expectedOxygen = "5";
        const expectedSpeed = "[+]";
        const expectedSpecial = "Test special";

        const dto = new ArmorItemFormFieldsDto(
            expectedName,
            expectedDescription,
            expectedCost,
            expectedArmorPoints,
            expectedOxygen,
            expectedSpeed,
            expectedSpecial
        );

        expect(dto.name).toBe(expectedName);
        expect(dto.description).toBe(expectedDescription);
        expect(dto.cost).toBe(expectedCost);
        expect(dto.armorPoints).toBe(expectedArmorPoints);
        expect(dto.oxygen).toBe(expectedOxygen);
        expect(dto.speed).toBe(expectedSpeed);
        expect(dto.special).toBe(expectedSpecial);
    });

    it("should be createable from a JSON string", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedArmorPoints = "2";
        const expectedOxygen = "5";
        const expectedSpeed = "[+]";
        const expectedSpecial = "Test special";
        const armorItemJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
            cost: expectedCost,
            armorPoints: expectedArmorPoints,
            oxygen: expectedOxygen,
            speed: expectedSpeed,
            special: expectedSpecial,
        });

        const dto = ArmorItemFormFieldsDto.createFromJson(armorItemJsonString);

        expect(dto.name).toBe(expectedName);
        expect(dto.description).toBe(expectedDescription);
        expect(dto.cost).toBe(expectedCost);
        expect(dto.armorPoints).toBe(expectedArmorPoints);
        expect(dto.oxygen).toBe(expectedOxygen);
        expect(dto.speed).toBe(expectedSpeed);
        expect(dto.special).toBe(expectedSpecial);
    });

    it("should be exportable to a JSON string", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedArmorPoints = "2";
        const expectedOxygen = "5";
        const expectedSpeed = "[+]";
        const expectedSpecial = "Test special";
        const expectedJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
            cost: expectedCost,
            armorPoints: expectedArmorPoints,
            oxygen: expectedOxygen,
            speed: expectedSpeed,
            special: expectedSpecial,
        });
        const dto = new ArmorItemFormFieldsDto(
            expectedName,
            expectedDescription,
            expectedCost,
            expectedArmorPoints,
            expectedOxygen,
            expectedSpeed,
            expectedSpecial
        );

        const result = dto.toJson();

        expect(result).toBe(expectedJsonString);
    });
});
