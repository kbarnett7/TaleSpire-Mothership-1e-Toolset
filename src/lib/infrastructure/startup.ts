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
        // this doesn't really work as intended, as much of the app is initialized at runtime, executing before this method runs.
        // I ran into this issue with initializing the database outside of the data access classes constructors (i.e. a separate
        // init() method), and the UI pages were initialize and attempted to access data before the database was initialized.
        // Leaving this here incase it is needed in the future, or if I can spend time to better figure out the initialization
        // structure of the app.

        const appSettings = appInjector.resolve("appSettings");

        while (!this._isTaleSpireInitialized) {
            // Add a small delay to avoid locking up the browser
            console.log("waiting for TaleSpire to be initialized()...");
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        if (appSettings.environment !== this.environmentProduction) {
            // const dbContext = appInjector.resolve("appDatabaseContext");
            // await dbContext.initialize();
        } else {
            // while (typeof TS === "undefined") {
            //     // Add a small delay to avoid locking up the browser
            //     await new Promise((resolve) => setTimeout(resolve, 10));
            // }
        }

        const dbContext = appInjector.resolve("appDatabaseContext");
        await dbContext.initialize();

        AppLogger.instance.addLogger(new ConsoleLogger());

        this._isConfigured = true;
    }
}
