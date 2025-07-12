import html from "./characters.html";
import { BaseComponent } from "../../base.component";
import { BasePageComponent } from "../base-page.component";

export class CharactersComponent extends BasePageComponent {
    constructor() {
        super();
        console.log("CharactersComponent constructor()...");
    }

    public async connectedCallback() {
        await super.connectedCallback();

        console.log("CharactersComponent connectedCallback()...");
        this.render(html);
    }
}

customElements.define("characters-page", CharactersComponent);
