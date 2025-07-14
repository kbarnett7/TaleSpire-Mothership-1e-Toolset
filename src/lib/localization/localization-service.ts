import enJson from "./en.json";

export class LocalizationService {
    private static _instance: LocalizationService;

    private readonly _jsonMessage: any;

    private constructor() {
        this._jsonMessage = JSON.parse(JSON.stringify(enJson));
    }

    public static get instance(): LocalizationService {
        if (!LocalizationService._instance) {
            LocalizationService._instance = new LocalizationService();
        }

        return LocalizationService._instance;
    }

    public translate(key: string): string {
        if (!(key in this._jsonMessage)) return "";

        return String(this._jsonMessage[key]);
    }
}
