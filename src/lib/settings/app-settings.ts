import jsonSetting from "../../appsettings.json";

export class AppSettings {
    public environment: string;
    public connectionString: string;

    constructor() {
        this.environment = jsonSetting.environment;
        this.connectionString = jsonSetting.connectionString;
    }
}
