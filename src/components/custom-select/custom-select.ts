import html from "./custom-select.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";

export class CustomSelectComponent extends BaseComponent {
    public onChange = null;

    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.registerDocumentEvent("click", this.onDocumentMouseClickEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregisterDocumentEvent("click", this.onDocumentMouseClickEvent);
    }

    private onDocumentMouseClickEvent = (event: Event) => {
        const menuElement = this.shadow.querySelector("#customSelectMenu") as HTMLDivElement;
        const eventPath = event.composedPath();

        if (!eventPath.includes(menuElement)) {
            this.closeMenu();
        }
    };

    public handleCustomSelectButtonClicked(event: MouseEvent) {
        event.stopPropagation();

        this.toggleMenu();
    }

    private toggleMenu() {
        const menuElement = this.shadow.querySelector("#customSelectMenu") as HTMLDivElement;
        menuElement.classList.toggle("opacity-100");
        menuElement.classList.toggle("scale-100");
    }

    public handleCustomSelectItemClicked(event: MouseEvent) {
        event.stopPropagation();

        if (typeof this.onchange === "function") {
            this.onchange(event);
        }

        this.updateSelectedItem(event.target as HTMLDivElement);
        this.updateActiveItem(event.target as HTMLDivElement);
        this.closeMenu();
    }

    private updateSelectedItem(clickedElement: HTMLDivElement) {
        const selectedItemElement = this.shadow.querySelector("#selectedItem") as HTMLSpanElement;
        const selectedItemInputElement = this.shadow.querySelector("#inputSelectedItem") as HTMLInputElement;

        selectedItemElement.innerText = clickedElement.innerText;
        selectedItemInputElement.value = clickedElement.getAttribute("data-value") ?? "";

        //(this.shadow.querySelector("#selectedValue") as HTMLParagraphElement).textContent = clickedElement.getAttribute("data-value") ?? "";
        // execute the callback the parent passes into this compoent.
    }

    private updateActiveItem(clickedElement: HTMLDivElement) {
        const menuElement = this.shadow.querySelector("#customSelectMenu") as HTMLDivElement;
        const itemElements = menuElement.children;

        for (const item of itemElements) {
            item.classList.remove("font-bold");
        }

        clickedElement.classList.add("font-bold");
    }

    private closeMenu() {
        const menuElement = this.shadow.querySelector("#customSelectMenu") as HTMLDivElement;
        menuElement.classList.remove("opacity-100");
        menuElement.classList.remove("scale-100");
    }
}

customElements.define("custom-select", CustomSelectComponent);
