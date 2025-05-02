export class CreditsAbbreviator {
    private static _instance: CreditsAbbreviator;

    private constructor() {}

    public static get instance(): CreditsAbbreviator {
        if (!CreditsAbbreviator._instance) {
            CreditsAbbreviator._instance = new CreditsAbbreviator();
        }

        return CreditsAbbreviator._instance;
    }

    public abbreviate(credits: number) {
        const absCredits = Math.abs(credits);
        let divisor = 1;
        let unit = "cr";

        if (absCredits < 1000) {
            // use default divisor and unit ...
        } else if (absCredits < 1000000) {
            divisor = 1000;
            unit = "kcr";
        } else if (absCredits < 1000000000) {
            divisor = 1000000;
            unit = "mcr";
        } else {
            divisor = 1000000000;
            unit = "bcr";
        }

        const dividend = credits / divisor;

        return `${dividend}${unit}`;
    }
}
