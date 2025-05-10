import html from "./header-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEvent } from "../../../lib/events/app-event";
import { UpdatePageTitleEvent } from "../../../lib/events/update-page-title-event";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";

export class HeaderBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(UpdatePageTitleEvent.name, (event: AppEvent) => {
            this.updatePageTitle((event as UpdatePageTitleEvent).newTitle);
        });
    }

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
