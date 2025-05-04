import html from "./home.component.html";
import { BaseComponent } from "../../base.component";

export class HomeComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("home-page", HomeComponent);
