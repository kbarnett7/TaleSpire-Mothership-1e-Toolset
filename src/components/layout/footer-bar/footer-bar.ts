import html from "./footer-bar.html";
import { BaseComponent } from "../../base.component";

export class FooterBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("footer-bar", FooterBarComponent);
