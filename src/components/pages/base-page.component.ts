import { appInjector } from "../../lib/infrastructure/app-injector";
import { BaseComponent } from "../base.component";

export abstract class BasePageComponent extends BaseComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        //await this.initializeApp();

        await this.waitForAppToBeInitialized();
    }

    private async waitForAppToBeInitialized() {
        const startup = appInjector.resolve("startup");

        while (!startup.isConfigured) {
            // Add a small delay to avoid locking up the browser
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
    }

    /**
     * Due to not having much control over the page and app lifecycle when using TypeScript
     * and componets, we use this area to initialize anything that needs to be initialized
     * outside of constructors but before the pages begin rendering. But only for non-production
     * environments. For production, we use the TaleSpire provided onStateChangeEvent.hasInitialized
     * lifecycle event to initialize the app. The file `taleSpireSubscriptionHandlers.ts` contains
     * the production initialization code.
     */
    private async initializeApp() {
        const appSettings = appInjector.resolve("appSettings");

        if (appSettings.environment !== "production") {
            const dbContext = appInjector.resolve("appDatabaseContext");
            await dbContext.initialize();
        } else {
            // while (typeof TS === "undefined") {
            //     // Add a small delay to avoid locking up the browser
            //     await new Promise((resolve) => setTimeout(resolve, 10));
            // }
        }
    }
}
