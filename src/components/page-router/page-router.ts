import html from "./page-router.html";
import { BaseComponent } from "../base.component";

export class PageRouterComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("page-router", PageRouterComponent);
