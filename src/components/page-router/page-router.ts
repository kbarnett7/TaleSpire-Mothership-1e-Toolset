import html from "./page-router.html";
import { BaseComponent } from "../base.component";
import { PageRouteData } from "../../lib/pages/page-route-data";
import { PageRouterService } from "../../lib/pages/page-router-service";
import { EventBus } from "../../lib/events/event-bus";
import { ChangePageEvent } from "../../lib/events/change-page-event";
import { AppEvent } from "../../lib/events/app-event";

export class PageRouterComponent extends BaseComponent {
    private currentPage: PageRouteData;

    constructor() {
        super();
        this.currentPage = PageRouterService.instance.getPageByTitle(PageRouterService.homePage);
    }

    public connectedCallback() {
        this.currentPage = this.getCurrentPageFromUrl();
        this.renderCorrectPage();

        // popstate is fired when the user hits the browser's "forward" and "back" buttons
        window.addEventListener("popstate", (event) => {
            if (event.state) {
                this.currentPage = event.state;
            } else {
                this.currentPage = PageRouterService.instance.getPageByTitle(PageRouterService.homePage);
            }

            this.renderCorrectPage();
        });
    }

    private getCurrentPageFromUrl(): PageRouteData {
        return PageRouterService.instance.getPageByPath(window.location.pathname);
    }

    private renderCorrectPage() {
        const elementId = "currentPage";
        const previousPage = this.shadow.getElementById(elementId);

        if (previousPage) {
            this.shadow.removeChild(previousPage);
        }

        const newPage = document.createElement(this.currentPage.component);
        newPage.id = elementId;

        EventBus.instance.register(ChangePageEvent.name, (event: AppEvent) => {
            console.log(`Change Page: ${event}`);
            this.gotoNewPage((event as ChangePageEvent).page);
        });

        this.shadow.appendChild(newPage);

        document.title = this.currentPage.title;
    }

    private gotoNewPage(newPage: PageRouteData) {
        this.currentPage = newPage;
        this.addCurrentPageToHistory();
        this.renderCorrectPage();
    }

    private addCurrentPageToHistory() {
        history.pushState(
            this.currentPage,
            this.currentPage.title,
            `${window.location.origin}/dist${this.currentPage.path}`
        );
    }
}

customElements.define("page-router", PageRouterComponent);
