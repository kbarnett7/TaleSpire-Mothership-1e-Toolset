import html from "./characters.html";
import { BaseComponent } from "../../base.component";

export class CharactersComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("characters-page", CharactersComponent);
