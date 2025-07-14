import html from "./app-init.html";
import { BaseComponent } from "../base.component";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { AppLogFormatter } from "../../lib/logging/app-log-formatter";

export class AppInitComponent extends BaseComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await this.initializeApp();

        this.render(html);
    }

    private async initializeApp() {
        console.info(AppLogFormatter.format("info", "Initializing app..."));

        const startup = appInjector.resolve("startup");

        await startup.configure();

        console.info(AppLogFormatter.format("info", "App initialization finished!"));
    }
}

customElements.define("app-init", AppInitComponent);
