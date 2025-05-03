import { StylesService } from "../lib/services/styles-service";

export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    protected render(html: string): void {
        const { shadowRoot } = this;

        if (!shadowRoot) return;

        StylesService.instance.addGlobalStylesToShadowRoot(shadowRoot);

        const template = document.createElement("template");
        template.innerHTML = this.attachCallbacks(html);
        const templateContent = template.content;
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    private attachCallbacks(html: string): string {
        const lastId: number = window.lastComponentId ? window.lastComponentId : 0;
        const componentId: number = lastId + 1;
        window.lastComponentId = componentId;

        const componentName: string = "component" + componentId;
        (window as any)[componentName] = this;
        return html.replaceAll("this.", `window.${componentName}.`);
    }
}
