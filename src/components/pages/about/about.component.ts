import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import { HtmlService } from "../../../infrastructure/html-service";

export class AboutComponent extends HTMLElement {
    constructor() {
        super();
    }

    public connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const wrapper = document.createElement("div");

        // HtmlService.instance.loadHTML("./components/pages/about/about.component.html", wrapper);

        wrapper.innerHTML = `
            <h1 style="margin-top: 0">About</h1>
            <p>This is the about page!</p>
        `;

        // Append the wrapper to the shadow DOM
        shadow.appendChild(wrapper);
    }
}

customElements.define("about-component", AboutComponent);
