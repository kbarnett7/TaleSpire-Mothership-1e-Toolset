export class StringService {
    private static _instance: StringService;

    private constructor() {}

    public static get instance(): StringService {
        if (!StringService._instance) {
            StringService._instance = new StringService();
        }

        return StringService._instance;
    }

    public isNullOrWhitespace(value: string): boolean {
        if (value === null || value === undefined) {
            return true;
        }

        if (value.trim().length === 0) {
            return true;
        }

        return false;
    }
}
