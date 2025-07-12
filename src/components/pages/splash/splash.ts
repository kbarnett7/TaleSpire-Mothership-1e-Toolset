import html from "./splash.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { AppSettings } from "../../../lib/settings/app-settings";
import { AppDatabaseContext } from "../../../lib/data-access/app-database-context";

declare const TS: any;

export class SplashComponent extends BaseComponent {
    constructor() {
        super();
        console.log("SplashComponent constructor()...");
    }

    public async connectedCallback() {
        console.log("SplashComponent connectedCallback()...");
        this.render(html);

        await this.waitUntilTaleSpireIsInitialized();

        this.navigateToPage(PageRouterService.charactersPage);
    }

    private async waitUntilTaleSpireIsInitialized() {
        const appSettings = appInjector.resolve("appSettings");

        if (appSettings.environment === "production") {
            while (typeof TS === "undefined") {
                // Add a small delay to avoid locking up the browser
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        }

        console.log("intializing db context from splash...");
        const dbContext = appInjector.resolve("appDatabaseContext");
        await dbContext.initialize();
    }

    private navigateToPage(page: string) {
        const changePageEvent = new ChangePageEvent(PageRouterService.instance.getPageByTitle(page));

        EventBus.instance.dispatch(changePageEvent);
    }
}

customElements.define("splash-page", SplashComponent);
