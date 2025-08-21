export class ValueUtils {
    static getRandomCharacter(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const index = Math.floor(Math.random() * chars.length);
        return chars.charAt(index);
    }

    static getStringOfRandomCharacters(length: number) {
        let result = "";

        for (let i = 0; i < length; i++) {
            result += ValueUtils.getRandomCharacter();
        }

        return result;
    }
}
