import html from "./npcs.html";
import { BasePageComponent } from "../base-page.component";

export class NpcsComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
    }
}

customElements.define("npcs-page", NpcsComponent);
