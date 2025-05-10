import { BaseComponent } from "../../base.component";
import html from "./footer-bar-nav-button.html";

export class FooterBarNavButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("footer-bar-nav-button", FooterBarNavButtonComponent);
