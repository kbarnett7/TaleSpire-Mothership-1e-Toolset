import html from "./custom-select.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { SelectOption } from "../../lib/selects/select-option";

export class CustomSelectComponent extends BaseComponent {
    public onOptionChange: (newValue: SelectOption) => void;

    protected get customSelectMenuElement(): HTMLDivElement {
        return this.shadow.querySelector("#customSelectMenu") as HTMLDivElement;
    }

    protected get optionElements(): HTMLCollection {
        return this.customSelectMenuElement.children;
    }

    protected get selectedOptionElement(): HTMLSpanElement {
        return this.shadow.querySelector("#selectedOption") as HTMLSpanElement;
    }

    protected get selectedOptionInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputSelectedOption") as HTMLInputElement;
    }

    constructor() {
        super();
        this.onOptionChange = this.defaultOnOptionChangeCallback;
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
        let hasSelectedFirstElement = false;

        menuElement.replaceChildren();

        for (const option of options) {
            const optionElement = this.createOptionElement(option);

            menuElement.appendChild(optionElement);

            if (hasSelectedFirstElement === false) {
                this.updateSelectedOptionElements(option);
                this.updateActiveOptionStyling(optionElement);

                hasSelectedFirstElement = true;
            }
        }
    }

    private createOptionElement(option: SelectOption): HTMLDivElement {
        const optionElement = document.createElement("div");

        optionElement.dataset.value = option.value;
        optionElement.innerText = option.text;

        optionElement.className =
            "whitespace-nowrap w-full px-1 hover:bg-gray-200 transition duration-150 ease-in-out cursor-pointer";

        optionElement.onclick = this.handleCustomSelectOptionClicked;

        return optionElement;
    }

    private onDocumentMouseClickEvent = (event: Event) => {
        const eventPath = event.composedPath();

        if (!eventPath.includes(this.customSelectMenuElement)) {
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

    public handleCustomSelectOptionClicked = (event: MouseEvent) => {
        event.stopPropagation();

        const selectedOptionElement = event.target as HTMLDivElement;
        const selectedOption = new SelectOption(selectedOptionElement.dataset.value, selectedOptionElement.innerText);

        if (selectedOption.value !== this.selectedOptionInputElement.value) {
            this.updateSelectedOptionElements(selectedOption);
            this.updateActiveOptionStyling(selectedOptionElement);
            this.onOptionChange(selectedOption);
        }

        this.closeMenu();
    };

    private updateSelectedOptionElements(selectedOption: SelectOption) {
        this.selectedOptionElement.innerText = selectedOption.text;
        this.selectedOptionInputElement.value = selectedOption.value;
    }

    private updateActiveOptionStyling(clickedElement: HTMLDivElement) {
        for (const optionElement of this.optionElements) {
            optionElement.classList.remove("font-bold");
        }

        clickedElement.classList.add("font-bold");
    }

    private closeMenu() {
        const menuElement = this.customSelectMenuElement;
        menuElement.classList.remove("opacity-100");
        menuElement.classList.remove("scale-100");
    }

    private defaultOnOptionChangeCallback(newValue: SelectOption): void {
        // intentionally do nothing...
    }
}

customElements.define("custom-select", CustomSelectComponent);
