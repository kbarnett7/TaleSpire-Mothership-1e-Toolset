import html from "./primary-button.html";
import { BaseComponent } from "../../base.component";

export class PrimaryButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("primary-button", PrimaryButtonComponent);
