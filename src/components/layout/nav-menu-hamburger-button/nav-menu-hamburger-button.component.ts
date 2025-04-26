import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import { HtmlService } from "../../../infrastructure/html-service";
import { NavMenuComponent } from "../nav-menu/nav-menu.component";

export class NavMenuHamburgerButtonComponent extends HTMLElement {
    constructor() {
        super();
    }
    public connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const container = document.createElement("template");

        HtmlService.instance.applyHtmlTo(
            "./components/layout/nav-menu-hamburger-button/nav-menu-hamburger-button.component.html",
            container
        );

        const button = container.content.querySelector("#navMenuHamburgerButton") as HTMLElement;
        button.addEventListener("click", () => {
            this.openNavMenu();
        });

        shadow.appendChild(button);
    }

    private openNavMenu() {
        const navMenu = document.querySelector("nav-menu") as NavMenuComponent;

        if (navMenu) {
            navMenu.openNav();
        }
    }
}

customElements.define("nav-menu-hamburger-button", NavMenuHamburgerButtonComponent);
