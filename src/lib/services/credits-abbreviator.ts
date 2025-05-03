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
        const absCredits: number = Math.abs(credits);
        const aThousand: number = 1000;
        const aMillion: number = 1000000;
        const aBillion: number = 1000000000;
        let divisor: number = 1;
        let unit: string = "cr";

        if (absCredits < aThousand) {
            // use default divisor and unit ...
        } else if (absCredits < aMillion) {
            divisor = aThousand;
            unit = "kcr";
        } else if (absCredits < aBillion) {
            divisor = aMillion;
            unit = "mcr";
        } else {
            divisor = aBillion;
            unit = "bcr";
        }

        const dividend = credits / divisor;

        return `${dividend}${unit}`;
    }
}
