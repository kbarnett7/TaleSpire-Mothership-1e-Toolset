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
        let negativeMultiplier = 1;

        if (credits < 0) {
            negativeMultiplier = -1;
        }

        if (absCredits < 1000) {
            return `${absCredits * negativeMultiplier}cr`;
        }

        console.log(`credits = ${credits}`);
        const dividend = (absCredits * negativeMultiplier) / 1000;
        console.log(`DIVIDEND = ${dividend}`);
        const dividendStr = dividend.toString();
        const decimalLocation: number = dividendStr.indexOf(".");
        console.log(`DEC LOCATION = ${decimalLocation}`);

        let wholePart: string = dividendStr;
        let fractialPart: string = "";
        let abbreviation: string = dividendStr;

        if (decimalLocation > -1) {
            const firstDecimal = dividendStr.at(decimalLocation + 1);
            console.log(`FIRST DECIMAL = ${firstDecimal}`);
            // wholePart = dividendStr.substring(0, decimalLocation);
            // fractialPart = `.${firstDecimal}`;
            abbreviation = dividendStr.substring(0, decimalLocation + 2);
            console.log(`ABBRE = ${abbreviation}`);
        }

        return `${abbreviation}kcr`;
        //return `${((absCredits * negativeMultiplier) / 1000).toFixed(1)}kcr`;
        //return `${Math.floor((absCredits * negativeMultiplier) / 1000)}kcr`;
    }
}
