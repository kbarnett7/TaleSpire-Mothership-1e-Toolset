import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import { NavMenuComponent } from "../nav-menu/nav-menu.component";

export class NavMenuHamburgerButtonComponent extends HTMLElement {
    constructor() {
        super();
    }
    public connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const button = document.createElement("span");
        button.innerHTML = "&#9776;";
        button.style = `font-size: 30px; cursor: pointer;`;
        button.addEventListener("click", () => {
            const navMenu = document.querySelector("nav-menu") as NavMenuComponent;
            if (navMenu) {
                navMenu.openNav();
            }
        });

        shadow.appendChild(button);
    }
}

customElements.define("nav-menu-hamburger-button", NavMenuHamburgerButtonComponent);
