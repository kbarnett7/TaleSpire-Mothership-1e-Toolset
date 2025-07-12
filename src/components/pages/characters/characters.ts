import html from "./characters.html";
import { BaseComponent } from "../../base.component";

export class CharactersComponent extends BaseComponent {
    constructor() {
        super();
        console.info("CharactersComponent constructor...");
    }

    public connectedCallback() {
        console.info("CharactersComponent connectedCallback()...");
        this.render(html);
    }
}

customElements.define("characters-page", CharactersComponent);
