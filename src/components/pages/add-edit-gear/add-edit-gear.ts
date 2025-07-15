import html from "./add-edit-gear.html";
import { BasePageComponent } from "../base-page.component";

export class AddEditGearComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
    }
}

customElements.define("add-edit-gear-page", AddEditGearComponent);
