import { appInjector } from "../../lib/infrastructure/app-injector";
import { BaseComponent } from "../base.component";

export abstract class BasePageComponent extends BaseComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await this.waitForAppToBeInitialized();
    }

    private async waitForAppToBeInitialized() {
        const startup = appInjector.resolve("startup");

        while (!startup.isConfigured) {
            // Add a small delay to avoid locking up the browser
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
    }
}
