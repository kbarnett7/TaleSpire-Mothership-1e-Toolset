import { BaseComponent } from "../../base.component";

export class NavMenuComponent extends BaseComponent {
    constructor() {
        super("/layout/nav-menu/nav-menu.component.html");
    }

    public async connectedCallback() {
        const shadow = await this.loadComponentHtmlIntoShadowDOM();

        this.configureCloseButton(shadow);
        this.configureHomeLink(shadow);
        this.configureAboutLink(shadow);
    }

    private configureCloseButton(shadow: ShadowRoot) {
        const closeButton = shadow.querySelector(".closebtn") as HTMLElement;
        closeButton.addEventListener("click", () => {
            this.closeNav();
        });
    }

    private configureHomeLink(shadow: ShadowRoot) {
        const link = shadow.querySelector("#homeLink") as HTMLElement;
        link.addEventListener("click", () => {
            this.loadPageComponent("home");
        });
    }

    private configureAboutLink(shadow: ShadowRoot) {
        const link = shadow.querySelector("#aboutLink") as HTMLElement;
        link.addEventListener("click", () => {
            this.loadPageComponent("about");
        });
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
