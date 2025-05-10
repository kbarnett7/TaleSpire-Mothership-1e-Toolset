import html from "./header-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { AppEvent } from "../../../lib/events/app-event";

export class HeaderBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(ChangePageEvent.name, (event: AppEvent) => {
            this.updatePageTitle((event as ChangePageEvent).page.title);
        });
    }

    private updatePageTitle(updatedTitle: string) {
        const pageTitleElement = this.shadow.querySelector("#pageTitle") as HTMLHeadElement;
        pageTitleElement.textContent = updatedTitle;
    }
}

customElements.define("header-bar", HeaderBarComponent);
