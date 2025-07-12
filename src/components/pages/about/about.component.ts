import html from "./about.component.html";
import { BaseComponent } from "../../base.component";
import { BasePageComponent } from "../base-page.component";

export class AboutComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
    }
}

customElements.define("about-page", AboutComponent);
