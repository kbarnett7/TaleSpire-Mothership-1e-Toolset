import html from "./nav-menu.component.html";
import { BaseComponent } from "../../base.component";
import { PageRouterService } from "../../../lib/pages/page-router-service";

export class NavMenuComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    private navigateToPage(page: string) {
        PageRouterService.instance.navigateToPage(page);
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
