import html from "./gear.component.html";
import { BaseComponent } from "../../base.component";

export class GearComponent extends BaseComponent {
    constructor() {
        super();
        console.info("GearComponent constructor...");
    }

    public connectedCallback() {
        console.info("GearComponent connectedCallback()...");
        this.render(html);
    }
}

customElements.define("gear-page", GearComponent);
