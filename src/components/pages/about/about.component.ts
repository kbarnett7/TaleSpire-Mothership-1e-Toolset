import html from "./about.component.html";
import { BaseComponent } from "../../base.component";

export class AboutComponent extends BaseComponent {
    constructor() {
        super("/pages/about/about.component.html");
    }

    public async connectedCallback() {
        //await this.loadComponentHtmlIntoShadowDOM();
        this.render(html, "");
    }
}

customElements.define("about-component", AboutComponent);
