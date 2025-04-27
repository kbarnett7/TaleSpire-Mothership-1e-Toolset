import { BaseComponent } from "../../base.component";

export class AboutComponent extends BaseComponent {
    constructor() {
        super("/pages/about/about.component.html");
    }

    public async connectedCallback() {
        await this.loadComponentHtmlIntoShadowDOM();
    }
}

customElements.define("about-component", AboutComponent);
