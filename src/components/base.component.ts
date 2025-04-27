import { addGlobalStylesToShadowRoot } from "../infrastructure/global-styles";
import { HtmlService } from "../infrastructure/html-service";
import { PathService } from "../infrastructure/path-service";

export class BaseComponent extends HTMLElement {
    private componentPath: string;

    constructor(componentPath: string) {
        super();
        this.componentPath = componentPath;
    }

    protected async loadComponentHtmlIntoShadowDOM(): Promise<ShadowRoot> {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const template = document.createElement("template");

        let rootComponentsPath: string = PathService.instance.getComponentsPath();

        await HtmlService.instance.applyHtmlTo(`${rootComponentsPath}${this.componentPath}`, template);

        shadow.appendChild(template.content);

        return shadow;
    }
}
