import html from "./custom-select.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { SelectOption } from "../../lib/selects/select-option";

export class CustomSelectComponent extends BaseComponent {
    public onChange = null;

    protected get customSelectMenuElement(): HTMLDivElement {
        return this.shadow.querySelector("#customSelectMenu") as HTMLDivElement;
    }

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

    public populateOptions(options: SelectOption[]) {
        const menuElement = this.customSelectMenuElement;

        menuElement.replaceChildren();

        for (const option of options) {
            menuElement.appendChild(this.createOptionElement(option));
        }
    }

    private createOptionElement(option: SelectOption): HTMLOptionElement {
        const optionElement = document.createElement("option");

        optionElement.value = option.value;
        optionElement.text = option.text;

        optionElement.className =
            "flex justify-start items-center hover:bg-gray-200 transition duration-150 ease-in-out cursor-pointer";

        optionElement.onclick = this.handleCustomSelectItemClicked;

        return optionElement;
    }

    private onDocumentMouseClickEvent = (event: Event) => {
        const menuElement = this.customSelectMenuElement;
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
        const menuElement = this.customSelectMenuElement;
        menuElement.classList.toggle("opacity-100");
        menuElement.classList.toggle("scale-100");
    }

    public handleCustomSelectItemClicked = (event: MouseEvent) => {
        event.stopPropagation();

        if (typeof this.onchange === "function") {
            this.onchange(event);
        }

        this.updateSelectedItem(event.target as HTMLDivElement);
        this.updateActiveItem(event.target as HTMLDivElement);
        this.closeMenu();
    };

    private updateSelectedItem(clickedElement: HTMLDivElement) {
        const selectedItemElement = this.shadow.querySelector("#selectedItem") as HTMLSpanElement;
        const selectedItemInputElement = this.shadow.querySelector("#inputSelectedItem") as HTMLInputElement;

        selectedItemElement.innerText = clickedElement.innerText;
        selectedItemInputElement.value = clickedElement.getAttribute("data-value") ?? "";

        //(this.shadow.querySelector("#selectedValue") as HTMLParagraphElement).textContent = clickedElement.getAttribute("data-value") ?? "";
        // execute the callback the parent passes into this compoent.
    }

    private updateActiveItem(clickedElement: HTMLDivElement) {
        const menuElement = this.customSelectMenuElement;
        const itemElements = menuElement.children;

        for (const item of itemElements) {
            item.classList.remove("font-bold");
        }

        clickedElement.classList.add("font-bold");
    }

    private closeMenu() {
        const menuElement = this.customSelectMenuElement;
        menuElement.classList.remove("opacity-100");
        menuElement.classList.remove("scale-100");
    }
}

customElements.define("custom-select", CustomSelectComponent);
