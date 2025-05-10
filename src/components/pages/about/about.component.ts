import html from "./about.component.html";
import { BaseComponent } from "../../base.component";

export class AboutComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("about-page", AboutComponent);
