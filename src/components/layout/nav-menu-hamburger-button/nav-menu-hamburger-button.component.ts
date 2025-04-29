import html from "./nav-menu-hamburger-button.component.html";
import { NavMenuComponent } from "../nav-menu/nav-menu.component";
import { BaseComponent } from "../../base.component";

export class NavMenuHamburgerButtonComponent extends BaseComponent {
    constructor() {
        super("/layout/nav-menu-hamburger-button/nav-menu-hamburger-button.component.html");
    }

    public async connectedCallback() {
        this.render(html, "");
        // const shadow = await this.loadComponentHtmlIntoShadowDOM();

        // const button = shadow.querySelector("#navMenuHamburgerButton") as HTMLElement;
        // button.addEventListener("click", () => {
        //     this.openNavMenu();
        // });

        const { shadowRoot } = this;

        if (!shadowRoot) return;

        const button = shadowRoot.querySelector("#navMenuHamburgerButton") as HTMLElement;
        button.addEventListener("click", () => {
            this.openNavMenu();
        });
    }

    private openNavMenu() {
        const navMenu = document.querySelector("nav-menu") as NavMenuComponent;

        if (navMenu) {
            navMenu.openNav();
        }
    }
}

customElements.define("nav-menu-hamburger-button", NavMenuHamburgerButtonComponent);
