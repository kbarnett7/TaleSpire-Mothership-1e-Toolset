import { BaseComponent } from "../../base.component";

export class HomeComponent extends BaseComponent {
    constructor() {
        super("/pages/home/home.component.html");
    }

    public async connectedCallback() {
        await this.loadComponentHtmlIntoShadowDOM();
    }
}

customElements.define("home-component", HomeComponent);
