import html from "./npcs.html";
import { BaseComponent } from "../../base.component";

export class NpcsComponent extends BaseComponent {
    constructor() {
        super();
        console.info("NpcsComponent constructor...");
    }

    public connectedCallback() {
        console.info("NpcsComponent connectedCallback()...");
        this.render(html);
    }
}

customElements.define("npcs-page", NpcsComponent);
