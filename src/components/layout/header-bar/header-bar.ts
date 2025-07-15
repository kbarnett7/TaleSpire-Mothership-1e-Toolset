import html from "./header-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEvent } from "../../../lib/events/app-event";
import { UpdatePageTitleEvent } from "../../../lib/events/update-page-title-event";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { ShowNavigateBackButtonEvent } from "../../../lib/events/show-navigate-back-button-event";
import { HideNavigateBackButtonEvent } from "../../../lib/events/hide-navigate-back-button-event";

export class HeaderBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(UpdatePageTitleEvent.name, this.onUpdatePageTitle);
        EventBus.instance.register(ShowNavigateBackButtonEvent.name, this.onShowNavigateBackButton);
        EventBus.instance.register(HideNavigateBackButtonEvent.name, this.onHideNavigateBackButton);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(UpdatePageTitleEvent.name, this.onUpdatePageTitle);
        EventBus.instance.unregister(ShowNavigateBackButtonEvent.name, this.onShowNavigateBackButton);
        EventBus.instance.unregister(HideNavigateBackButtonEvent.name, this.onHideNavigateBackButton);
    }

    private onUpdatePageTitle: AppEventListener = (event: AppEvent) => {
        this.updatePageTitle((event as UpdatePageTitleEvent).newTitle);
    };

    private onShowNavigateBackButton: AppEventListener = (event: AppEvent) => {
        //alert("show back nav button");
    };

    private onHideNavigateBackButton: AppEventListener = (event: AppEvent) => {
        //alert("show back nav button");
    };

    private updatePageTitle(updatedTitle: string) {
        const pageTitleElement = this.shadow.querySelector("#pageTitle") as HTMLHeadElement;
        pageTitleElement.textContent = updatedTitle;
    }

    private navigateToPage(page: string) {
        const changePageEvent = new ChangePageEvent(PageRouterService.instance.getPageByTitle(page));

        EventBus.instance.dispatch(changePageEvent);
    }
}

customElements.define("header-bar", HeaderBarComponent);
