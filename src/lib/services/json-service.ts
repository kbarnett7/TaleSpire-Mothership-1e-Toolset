export class JsonService {
    private static _instance: JsonService;

    private constructor() {}

    public static get instance(): JsonService {
        if (!JsonService._instance) {
            JsonService._instance = new JsonService();
        }

        return JsonService._instance;
    }

    public concat(jsonObjects: string[]): string {
        if (jsonObjects.length === 0) return "{}";

        let combinedJsonString = "{";

        for (let currentJsonString of jsonObjects) {
            combinedJsonString += `${this.getJsonFields(currentJsonString)},`;
        }

        combinedJsonString = this.removeTrailingComma(combinedJsonString);

        combinedJsonString += "}";

        return combinedJsonString;
    }

    private getJsonFields(json: string) {
        return json.substring(1, json.length - 1);
    }

    private removeTrailingComma(value: string) {
        if (value.charAt(value.length - 1) !== ",") {
            return value;
        }

        return value.slice(0, value.length - 1);
    }
}
