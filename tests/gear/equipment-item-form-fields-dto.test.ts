import { EquipmentItemFormFieldsDto } from "../../src/features/gear/equipment-item-form-fields-dto";

describe("EquipmentItemFormFieldsDto", () => {
    it("should be createable from a constructor", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";

        const dto = new EquipmentItemFormFieldsDto(expectedName, expectedDescription, expectedCost);

        expect(dto.name).toBe(expectedName);
        expect(dto.description).toBe(expectedDescription);
        expect(dto.cost).toBe(expectedCost);
    });

    it("should be createable from a JSON string", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const jsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
            cost: expectedCost,
        });

        const dto = EquipmentItemFormFieldsDto.createFromJson(jsonString);

        expect(dto.name).toBe(expectedName);
        expect(dto.description).toBe(expectedDescription);
        expect(dto.cost).toBe(expectedCost);
    });

    it("should be exportable to a JSON string", () => {
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedCost = "1000";
        const expectedJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
            cost: expectedCost,
        });
        const dto = new EquipmentItemFormFieldsDto(expectedName, expectedDescription, expectedCost);

        const result = dto.toJson();

        expect(result).toBe(expectedJsonString);
    });
});
