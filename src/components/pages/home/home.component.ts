import html from "./home.component.html";
import { BaseComponent } from "../../base.component";

export class HomeComponent extends BaseComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        this.render(html);
    }
}

customElements.define("home-component", HomeComponent);
