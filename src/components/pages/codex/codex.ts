import html from "./codex.html";
import { BaseComponent } from "../../base.component";

export class CodexComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("codex-page", CodexComponent);
