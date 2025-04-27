import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import { HtmlService } from "../../../infrastructure/html-service";
import { PathService } from "../../../infrastructure/path-service";

export class AboutComponent extends HTMLElement {
    constructor() {
        super();
    }

    public async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const template = document.createElement("template");

        let path: string = PathService.instance.getComponentsPath();

        await HtmlService.instance.applyHtmlTo(`${path}/pages/about/about.component.html`, template);

        shadow.appendChild(template.content);
    }
}

customElements.define("about-component", AboutComponent);
