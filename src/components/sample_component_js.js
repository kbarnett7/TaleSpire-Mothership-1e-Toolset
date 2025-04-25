class SampleComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("div");
        wrapper.textContent = "Hello, Sample Component!";
        shadow.appendChild(wrapper);
    }
}

customElements.define("sample-component", SampleComponent);
