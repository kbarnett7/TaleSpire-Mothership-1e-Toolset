import { StylesService } from "../lib/services/styles-service";

export class BaseComponent extends HTMLElement {
    protected shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    protected render(html: string): void {
        StylesService.instance.addGlobalStylesToShadowRoot(this.shadow);

        const template = document.createElement("template");
        template.innerHTML = this.attachCallbacks(html);
        const templateContent = template.content;
        this.shadow.appendChild(templateContent.cloneNode(true));
    }

    protected attachCallbacks(html: string): string {
        const lastId: number = window.lastComponentId ? window.lastComponentId : 0;
        const componentId: number = lastId + 1;
        window.lastComponentId = componentId;

        const componentName: string = "component" + componentId;
        (window as any)[componentName] = this;
        return html.replaceAll("this.", `window.${componentName}.`);
    }
}
