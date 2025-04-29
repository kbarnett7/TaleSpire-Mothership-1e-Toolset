import html from "./nav-menu.component.html";
import { BaseComponent } from "../../base.component";

export class NavMenuComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html, "");
    }

    private loadPageComponent(page: string) {
        let pageDiv = document.querySelector("#page");

        if (pageDiv) {
            pageDiv.innerHTML = `<${page}-component></${page}-component>`;
        }
    }

    public openNav() {
        const sidenav = this.shadowRoot?.querySelector("#mySidenav");
        if (sidenav) {
            (sidenav as HTMLElement).style.width = "250px";
        }
    }

    private closeNav() {
        const sidenav = this.shadowRoot?.querySelector("#mySidenav");
        if (sidenav) {
            (sidenav as HTMLElement).style.width = "0";
        }
    }
}

customElements.define("nav-menu", NavMenuComponent);
