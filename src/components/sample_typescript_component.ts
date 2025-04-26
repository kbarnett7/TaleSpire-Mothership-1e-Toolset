import { HtmlService } from "../infrastructure/html-service";

class SampleTypeScriptComponent extends HTMLElement {
    constructor() {
        super();
    }

    public connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("div");
        //wrapper.textContent = "Hello, Sample TypeScript Component!";
        HtmlService.instance.applyHtmlTo("./components/sample_component.html", wrapper);
        shadow.appendChild(wrapper);
    }
}

customElements.define("sample-ts-component", SampleTypeScriptComponent);
