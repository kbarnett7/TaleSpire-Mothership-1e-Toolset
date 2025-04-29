import html from "./home.component.html";
import { BaseComponent } from "../../base.component";

export class HomeComponent extends BaseComponent {
    constructor() {
        super("/pages/home/home.component.html");
    }

    public async connectedCallback() {
        //await this.loadComponentHtmlIntoShadowDOM();
        this.render(html, "");
    }
}

customElements.define("home-component", HomeComponent);
