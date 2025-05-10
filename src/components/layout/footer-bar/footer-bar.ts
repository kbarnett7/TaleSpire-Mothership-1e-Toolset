import html from "./footer-bar.html";
import { BaseComponent } from "../../base.component";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { EventBus } from "../../../lib/events/event-bus";

export class FooterBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    private navigateToPage(page: string) {
        const changePageEvent = new ChangePageEvent(PageRouterService.instance.getPageByTitle(page));

        EventBus.instance.dispatch(changePageEvent);
    }

    private openMoreOptionsMenu() {
        const moreOptionsMenu = this.shadow.querySelector("#moreOptionsMenu") as HTMLDivElement;
        moreOptionsMenu.classList.remove("hidden");
    }
}

customElements.define("footer-bar", FooterBarComponent);
