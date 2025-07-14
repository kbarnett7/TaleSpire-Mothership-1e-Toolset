import { AppLogger } from "../logging/app-logger";
import { ConsoleLogger } from "../logging/console-logger";
import { AppSettings } from "../settings/app-settings";
import { appInjector } from "./app-injector";

export class Startup {
    public static inject = ["appSettings"] as const;

    private readonly environmentProduction: string = "production";

    private readonly appSettings: AppSettings;

    private _isConfigured: boolean;
    private _isTaleSpireInitialized: boolean;

    public get isConfigured(): boolean {
        return this._isConfigured;
    }

    constructor(appSettings: AppSettings) {
        this._isConfigured = false;
        this._isTaleSpireInitialized = false;
        this.appSettings = appSettings;

        if (this.appSettings.environment !== this.environmentProduction) {
            this._isTaleSpireInitialized = true;
        }
    }

    public setTaleSpireApiInitialized() {
        this._isTaleSpireInitialized = true;
    }

    public async configure(): Promise<void> {
        this.configureLogging();

        await this.waitForTaleSpireApiToBeInitialized();

        await this.configureDatabaseContext();

        this._isConfigured = true;
    }

    private configureLogging(): void {
        AppLogger.instance.addLogger(new ConsoleLogger());
    }

    private async waitForTaleSpireApiToBeInitialized(): Promise<void> {
        AppLogger.instance.info("Waiting for TaleSpire API to be initialized...");

        while (!this._isTaleSpireInitialized) {
            // Add a small delay to avoid locking up the browser
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        AppLogger.instance.info("TaleSpire API initialized!");
    }

    private async configureDatabaseContext(): Promise<void> {
        const dbContext = appInjector.resolve("appDatabaseContext");

        await dbContext.initialize();
    }
}
