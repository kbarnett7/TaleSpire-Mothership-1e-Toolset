import html from "./nav-menu.component.html";
import { BaseComponent } from "../../base.component";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { EventBus } from "../../../lib/events/event-bus";

export class NavMenuComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    private loadPageComponent(page: string) {
        console.log(`Try to go to page: ${page}`);

        const changePageEvent = new ChangePageEvent(PageRouterService.instance.getPageByTitle(page));
        EventBus.instance.dispatch(changePageEvent);
    }

    public openNav() {
        const sidenav = this.shadow.querySelector("#mySidenav");
        if (sidenav) {
            (sidenav as HTMLElement).style.width = "250px";
        }
    }

    private closeNav() {
        const sidenav = this.shadow.querySelector("#mySidenav");
        if (sidenav) {
            (sidenav as HTMLElement).style.width = "0";
        }
    }
}

customElements.define("nav-menu", NavMenuComponent);
