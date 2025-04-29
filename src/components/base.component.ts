import { addGlobalStylesToShadowRoot } from "../infrastructure/global-styles";
import { HtmlService } from "../infrastructure/html-service";
import { PathService } from "../infrastructure/path-service";

// Extend the Window interface to include lastComponentId
declare global {
    interface Window {
        lastComponentId?: number;
    }
}

export class BaseComponent extends HTMLElement {
    private componentPath: string;

    constructor(componentPath: string) {
        super();
        this.componentPath = componentPath;
        this.attachShadow({ mode: "open" });
    }

    protected render(html: string, css: string): void {
        // const { shadowRoot } = this;

        // if (!shadowRoot) return;

        // const { cssContent, htmlContent } = this.htmlToElement(html);
        // shadowRoot.innerHTML = "";
        // //shadowRoot.appendChild(cssContent);

        // if (htmlContent) shadowRoot.appendChild(htmlContent);

        const { shadowRoot } = this;

        if (!shadowRoot) return;

        addGlobalStylesToShadowRoot(shadowRoot);

        const template = document.createElement("template");
        template.innerHTML = "<style>" + css + "</style>" + this.attachCallbacks(html);
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

    // protected htmlToElement(html: string): { cssContent: ChildNode | null; htmlContent: ChildNode | null } {
    //     var template = document.createElement("template");
    //     html = html.trim(); // Never return a text node of whitespace as the result
    //     template.innerHTML = html;
    //     return { cssContent: template.content.firstChild, htmlContent: template.content.lastChild };
    // }

    // protected async loadComponentHtmlIntoShadowDOM(): Promise<ShadowRoot> {
    //     const shadow = this.attachShadow({ mode: "open" });
    //     addGlobalStylesToShadowRoot(shadow);

    //     const template = document.createElement("template");

    //     let rootComponentsPath: string = PathService.instance.getComponentsPath();

    //     await HtmlService.instance.applyHtmlTo(`${rootComponentsPath}${this.componentPath}`, template);

    //     shadow.appendChild(template.content);

    //     return shadow;
    // }
}
