import { CreditsAbbreviator } from "../src/services/credits-abbreviator";

describe("Credits Abbreviator", () => {
    it.each([
        [0, "0cr"],
        [1, "1cr"],
        [-1, "-1cr"],
        [10, "10cr"],
        [100, "100cr"],
        [999, "999cr"],
        [1000, "1kcr"],
        [-1000, "-1kcr"],
        [2500, "2.5kcr"],
        [10000, "10kcr"],
        [100000, "100kcr"],
        [999999, "999.9kcr"],
        [1000000, "1mcr"],
    ])("abbreviate %i returns %icr", (value: number, expected: string) => {
        // Arrange

        // Act
        const result = CreditsAbbreviator.instance.abbreviate(value);

        // Assert
        expect(result).toBe(expected);
    });
});
