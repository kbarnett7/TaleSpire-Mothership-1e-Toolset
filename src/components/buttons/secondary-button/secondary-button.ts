import html from "./secondary-button.html";
import { BaseComponent } from "../../base.component";

export class SecondaryButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("secondary-button", SecondaryButtonComponent);
