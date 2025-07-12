import html from "./codex.html";
import { BasePageComponent } from "../base-page.component";

export class CodexComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
    }
}

customElements.define("codex-page", CodexComponent);
