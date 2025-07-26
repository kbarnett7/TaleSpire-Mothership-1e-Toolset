import html from "./page-router.html";
import { BaseComponent } from "../base.component";
import { PageRouteData } from "../../lib/pages/page-route-data";
import { PageRouterService } from "../../lib/pages/page-router-service";
import { EventBus } from "../../lib/events/event-bus";
import { ChangePageEvent } from "../../lib/events/change-page-event";
import { AppEvent } from "../../lib/events/app-event";
import { UpdatePageTitleEvent } from "../../lib/events/update-page-title-event";
import { AppEventListener } from "../../lib/events/app-event-listener-interface";

export class PageRouterComponent extends BaseComponent {
    private _currentPage: PageRouteData = new PageRouteData("", "", "");

    private get currentPage(): PageRouteData {
        return this._currentPage;
    }

    private set currentPage(value: PageRouteData) {
        this._currentPage = value;

        EventBus.instance.dispatch(new UpdatePageTitleEvent(this.currentPage.title));
    }

    constructor() {
        super();
        this.currentPage = PageRouterService.instance.getPageByTitle(PageRouterService.charactersPage);
    }

    public connectedCallback() {
        this.currentPage = this.getCurrentPageFromUrl();
        this.renderCorrectPage();

        EventBus.instance.registerBrowserEvent("popstate", this.onPopStateEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregisterBrowserEvent("popstate", this.onPopStateEvent);
        EventBus.instance.unregister(ChangePageEvent.name, this.onChangePageEvent);
    }

    private onPopStateEvent = (event: Event) => {
        // popstate is fired when the user hits the browser's "forward" and "back" buttons
        const popStateEvent = event as PopStateEvent;

        if (popStateEvent.state) {
            this.currentPage = popStateEvent.state;
        } else {
            this.currentPage = PageRouterService.instance.getPageByTitle(PageRouterService.charactersPage);
        }

        this.renderCorrectPage();
    };

    private getCurrentPageFromUrl(): PageRouteData {
        return PageRouterService.instance.getPageByPath(window.location.pathname);
    }

    private renderCorrectPage() {
        const elementId = "currentPage";
        const previousPage = this.shadow.getElementById(elementId);

        if (previousPage) {
            EventBus.instance.unregister(ChangePageEvent.name, this.onChangePageEvent);
            this.shadow.removeChild(previousPage);
        }

        const newPage = document.createElement(this.currentPage.component);
        newPage.id = elementId;

        EventBus.instance.register(ChangePageEvent.name, this.onChangePageEvent);

        this.shadow.appendChild(newPage);

        document.title = `${this.currentPage.title} - TaleSpire Mothership 1e Toolset`;
    }

    private onChangePageEvent: AppEventListener = (event: AppEvent) => {
        this.gotoNewPage(event as ChangePageEvent);
    };

    private gotoNewPage(event: ChangePageEvent) {
        this.currentPage = event.page;
        this.addCurrentPageToHistory(event);
        this.renderCorrectPage();
    }

    private addCurrentPageToHistory(event: ChangePageEvent) {
        let url = `${window.location.origin}${this.currentPage.path}`;

        if (event.id !== "") {
            url = url.replace("#", event.id);
        }

        history.pushState(this.currentPage, this.currentPage.title, url);
    }
}

customElements.define("page-router", PageRouterComponent);
