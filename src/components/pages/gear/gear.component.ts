import html from "./gear.component.html";
import { BasePageComponent } from "../base-page.component";

export class GearComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
    }
}

customElements.define("gear-page", GearComponent);
