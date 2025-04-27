import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import { HtmlService } from "../../../infrastructure/html-service";
import { PathService } from "../../../infrastructure/path-service";

export class HomeComponent extends HTMLElement {
    constructor() {
        super();
    }

    public async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const template = document.createElement("template");

        let path: string = PathService.instance.getComponentsPath();

        await HtmlService.instance.applyHtmlTo(`${path}/pages/home/home.component.html`, template);

        shadow.appendChild(template.content);
    }
}

customElements.define("home-component", HomeComponent);
