import html from "./header-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEvent } from "../../../lib/events/app-event";
import { UpdatePageTitleEvent } from "../../../lib/events/update-page-title-event";

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
}

customElements.define("header-bar", HeaderBarComponent);
