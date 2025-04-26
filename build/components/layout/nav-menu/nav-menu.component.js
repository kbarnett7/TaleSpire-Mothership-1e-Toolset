import HtmlService from "../../../infrastructure/html-service";
class NavMenuComponent extends HTMLElement {
    constructor() {
        super();
        this.htmlService = new HtmlService();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("div");
        //wrapper.textContent = "Hello, Sample TypeScript Component!";
        this.htmlService.loadHTML("../src/components/sample_component.html", wrapper);
        shadow.appendChild(wrapper);
    }
}
customElements.define("nav-menu", NavMenuComponent);
