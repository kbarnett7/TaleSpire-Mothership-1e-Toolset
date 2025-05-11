import html from "./npcs.html";
import { BaseComponent } from "../../base.component";

export class NpcsComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("npcs-page", NpcsComponent);
