import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";

export class HomeComponent extends HTMLElement {
    constructor() {
        super();
    }

    public connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <h1 style="margin-top: 0">Home</h1>
            <p>This is the home page!</p>
        `;

        // Append the wrapper to the shadow DOM
        shadow.appendChild(wrapper);
    }
}

customElements.define("home-component", HomeComponent);
