import { appInjector } from "../../lib/infrastructure/app-injector";
import { BaseComponent } from "../base.component";

export abstract class BasePageComponent extends BaseComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await this.waitUntilTaleSpireIsInitialized();
    }

    private async waitUntilTaleSpireIsInitialized() {
        const appSettings = appInjector.resolve("appSettings");

        if (appSettings.environment === "production") {
            while (typeof TS === "undefined") {
                // Add a small delay to avoid locking up the browser
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        }

        const dbContext = appInjector.resolve("appDatabaseContext");
        await dbContext.initialize();
    }
}
