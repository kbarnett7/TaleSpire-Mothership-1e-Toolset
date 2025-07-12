import html from "./app-init.html";
import { BaseComponent } from "../base.component";
import { appInjector } from "../../lib/infrastructure/app-injector";

export class AppInitComponent extends BaseComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        console.log("AppInitComponent.connectedCallback()...");
        await this.initializeApp();
        this.render(html);
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
        console.log("initializeApp() started...");

        const startup = appInjector.resolve("startup");
        await startup.configure();

        console.log("initializeApp() finished!");
    }
}

customElements.define("app-init", AppInitComponent);
