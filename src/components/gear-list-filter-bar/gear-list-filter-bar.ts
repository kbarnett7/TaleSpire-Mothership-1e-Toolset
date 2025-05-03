import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../base.component";

export class GearListFilterBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
