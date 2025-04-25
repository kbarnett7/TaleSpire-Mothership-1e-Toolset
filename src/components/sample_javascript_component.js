class SampleJavaScriptComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("div");
        wrapper.textContent = "Hello, Sample JavaScript Component!";
        shadow.appendChild(wrapper);
    }
}

customElements.define("sample-js-component", SampleJavaScriptComponent);
