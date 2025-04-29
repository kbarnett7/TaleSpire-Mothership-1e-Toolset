import html from "./nav-menu-hamburger-button.component.html";
import { NavMenuComponent } from "../nav-menu/nav-menu.component";
import { BaseComponent } from "../../base.component";

export class NavMenuHamburgerButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    private openNavMenu() {
        const navMenu = document.querySelector("nav-menu") as NavMenuComponent;

        if (navMenu) {
            navMenu.openNav();
        }
    }
}

customElements.define("nav-menu-hamburger-button", NavMenuHamburgerButtonComponent);
