import { LocalizationService } from "../src/lib/localization/localization-service";

describe("LocalizationService", () => {
    it("should return an empty string for a key that does not exist", () => {
        const result = LocalizationService.instance.translate("non-existant-key");

        expect(result).toBe("");
    });

    it("should return a non-empty string for a key that does exist", () => {
        const result = LocalizationService.instance.translate("appTitle");

        expect(result.trim()).not.toBe("");
        expect(result.length).toBeGreaterThan(0);
    });
});
