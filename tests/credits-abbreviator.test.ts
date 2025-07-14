import { CreditsAbbreviator } from "../src/lib/services/credits-abbreviator";

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
        [999000, "999kcr"],
        [999999, "999.999kcr"],
        [1000000, "1mcr"],
        [10000000, "10mcr"],
        [35200000, "35.2mcr"],
        [100000000, "100mcr"],
        [999999999, "999.999999mcr"],
        [1000000000, "1bcr"],
        [4500000000, "4.5bcr"],
    ])("abbreviate %i returns %s", (value: number, expected: string) => {
        // Arrange

        // Act
        const result = CreditsAbbreviator.instance.abbreviate(value);

        // Assert
        expect(result).toBe(expected);
    });
});
