import { JsonService } from "../src/lib/services/json-service";

describe("JsonService", () => {
    it("should return an empty JSON object string when concatenating zero JSON object strings together.", () => {
        // Act
        const combinedJson = JsonService.instance.concat([]);

        // Assert
        expect(combinedJson).toBe("{}");
    });

    it("should return the sole JSON object string when concatenating one JSON object strings together.", () => {
        // Arrange
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const equipmentItemJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
        });

        // Act
        const combinedJson = JsonService.instance.concat([equipmentItemJsonString]);

        // Assert
        expect(combinedJson).toBe(equipmentItemJsonString);
    });

    it("should return a single JSON object string when concatenating two JSON object strings together.", () => {
        // Arrange
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedArmorPoints = "2";
        const expectedOxygen = "5";
        const equipmentItemJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
        });

        const armorItemJsonString = JSON.stringify({
            armorPoints: expectedArmorPoints,
            oxygen: expectedOxygen,
        });

        // Act
        const combinedJson = JsonService.instance.concat([equipmentItemJsonString, armorItemJsonString]);

        // Assert
        const parsedJson = JSON.parse(combinedJson);
        expect(parsedJson.name).toBe(expectedName);
        expect(parsedJson.description).toBe(expectedDescription);
        expect(parsedJson.armorPoints).toBe(expectedArmorPoints);
        expect(parsedJson.oxygen).toBe(expectedOxygen);
    });

    it("should return a single JSON object string when concatenating three JSON object strings together.", () => {
        // Arrange
        const expectedName = "Test Name";
        const expectedDescription = "Test Description";
        const expectedArmorPoints = "2";
        const expectedOxygen = "5";
        const expectedSpecial = "Test Special";
        const equipmentItemJsonString = JSON.stringify({
            name: expectedName,
            description: expectedDescription,
        });

        const armorItemJsonString = JSON.stringify({
            armorPoints: expectedArmorPoints,
            oxygen: expectedOxygen,
        });

        const specialJsonString = JSON.stringify({
            special: expectedSpecial,
        });

        // Act
        const combinedJson = JsonService.instance.concat([
            equipmentItemJsonString,
            armorItemJsonString,
            specialJsonString,
        ]);

        // Assert
        const parsedJson = JSON.parse(combinedJson);
        expect(parsedJson.name).toBe(expectedName);
        expect(parsedJson.description).toBe(expectedDescription);
        expect(parsedJson.armorPoints).toBe(expectedArmorPoints);
        expect(parsedJson.oxygen).toBe(expectedOxygen);
        expect(parsedJson.special).toBe(expectedSpecial);
    });
});
