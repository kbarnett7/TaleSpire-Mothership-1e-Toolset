import html from "./header-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEvent } from "../../../lib/events/app-event";
import { PageChangedEvent } from "../../../lib/events/page-changed-event";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";

export class HeaderBarComponent extends BaseComponent {
    private navigateBackPage: string;

    constructor() {
        super();
        this.navigateBackPage = "";
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(PageChangedEvent.name, this.onPageChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(PageChangedEvent.name, this.onPageChangedEvent);
    }

    private onPageChangedEvent: AppEventListener = (event: AppEvent) => {
        const pageChangedEvent = event as PageChangedEvent;

        this.updatePageTitle(pageChangedEvent.currentPage.title);
        this.updateNavigateBackButton(pageChangedEvent);
    };

    private updatePageTitle(updatedTitle: string) {
        const pageTitleElement = this.shadow.querySelector("#pageTitle") as HTMLHeadElement;
        pageTitleElement.textContent = updatedTitle;
    }

    private updateNavigateBackButton(pageChangedEvent: PageChangedEvent) {
        if (pageChangedEvent.currentPage.canNavigateBackFrom) {
            this.navigateBackPage = pageChangedEvent.previousPage.title;
            this.showNavigateBackButton();
        } else {
            this.navigateBackPage = "";
            this.hideNavigateBackButton();
        }
    }

    private showNavigateBackButton() {
        const backButtonElement = this.getNavigateBackButtonElement();
        backButtonElement?.classList.remove("hidden");
    }

    private hideNavigateBackButton() {
        const backButtonElement = this.getNavigateBackButtonElement();
        backButtonElement?.classList.add("hidden");
    }

    private getNavigateBackButtonElement(): Element | null {
        return this.shadow.querySelector("#navigateBackButton");
    }

    public navigateToPage(page: string) {
        const changePageEvent = new ChangePageEvent(PageRouterService.instance.getPageByTitle(page));

        EventBus.instance.dispatch(changePageEvent);
    }

    public navigateBack() {
        this.navigateToPage(this.navigateBackPage);
    }
}

customElements.define("header-bar", HeaderBarComponent);
