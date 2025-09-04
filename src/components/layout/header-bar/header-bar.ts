import html from "./header-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEvent } from "../../../lib/events/app-event";
import { PageChangedEvent } from "../../../lib/events/page-changed-event";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { ShowNavigateBackButtonEvent } from "../../../lib/events/show-navigate-back-button-event";
import { HideNavigateBackButtonEvent } from "../../../lib/events/hide-navigate-back-button-event";

export class HeaderBarComponent extends BaseComponent {
    private navigateBackPage: string;

    constructor() {
        super();
        this.navigateBackPage = "";
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(PageChangedEvent.name, this.onUpdatePageTitle);
        EventBus.instance.register(ShowNavigateBackButtonEvent.name, this.onShowNavigateBackButton);
        EventBus.instance.register(HideNavigateBackButtonEvent.name, this.onHideNavigateBackButton);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(PageChangedEvent.name, this.onUpdatePageTitle);
        EventBus.instance.unregister(ShowNavigateBackButtonEvent.name, this.onShowNavigateBackButton);
        EventBus.instance.unregister(HideNavigateBackButtonEvent.name, this.onHideNavigateBackButton);
    }

    private onUpdatePageTitle: AppEventListener = (event: AppEvent) => {
        this.updatePageTitle((event as PageChangedEvent).newTitle);
    };

    private onShowNavigateBackButton: AppEventListener = (event: AppEvent) => {
        const showEvent = event as ShowNavigateBackButtonEvent;

        this.navigateBackPage = showEvent.backToRoute.title;

        this.showNavigateBackButton();
    };

    private onHideNavigateBackButton: AppEventListener = (event: AppEvent) => {
        this.navigateBackPage = "";

        this.hideNavigateBackButton();
    };

    private updatePageTitle(updatedTitle: string) {
        const pageTitleElement = this.shadow.querySelector("#pageTitle") as HTMLHeadElement;
        pageTitleElement.textContent = updatedTitle;
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
