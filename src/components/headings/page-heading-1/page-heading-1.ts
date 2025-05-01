import html from "./page-heading-1.html";
import { BaseComponent } from "../../base.component";

export class PageHeading1Component extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("page-heading-1", PageHeading1Component);