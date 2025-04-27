import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import { HtmlService } from "../../../infrastructure/html-service";
import { PathService } from "../../../infrastructure/path-service";
import { NavMenuComponent } from "../nav-menu/nav-menu.component";

export class NavMenuHamburgerButtonComponent extends HTMLElement {
    constructor() {
        super();
    }

    public async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const template = document.createElement("template");

        let path: string = PathService.instance.getComponentsPath();

        await HtmlService.instance.applyHtmlTo(
            `${path}/layout/nav-menu-hamburger-button/nav-menu-hamburger-button.component.html`,
            template
        );

        const button = template.content.querySelector("#navMenuHamburgerButton") as HTMLElement;
        button.addEventListener("click", () => {
            this.openNavMenu();
        });

        shadow.appendChild(button);

        // HtmlService.instance
        //     .loadHtml("./components/layout/nav-menu-hamburger-button/nav-menu-hamburger-button.component.html")
        //     .then((html) => {
        //         const template = document.createElement("template");
        //         template.innerHTML = html.trim();

        //         const button = template.content.querySelector("#navMenuHamburgerButton") as HTMLElement;

        //         button.addEventListener("click", () => {
        //             this.openNavMenu();
        //         });

        //         shadow.appendChild(button);
        //     });
    }

    private openNavMenu() {
        const navMenu = document.querySelector("nav-menu") as NavMenuComponent;

        if (navMenu) {
            navMenu.openNav();
        }
    }
}

customElements.define("nav-menu-hamburger-button", NavMenuHamburgerButtonComponent);
