import html from "./characters.html";
import { BasePageComponent } from "../base-page.component";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { DatabaseVersion } from "../../../features/database-versions/database-version";
import { EventBus } from "../../../lib/events/event-bus";
import { CustomSelectComponent } from "../../custom-select/custom-select";
import { SelectOption } from "../../../lib/selects/select-option";

export class CharactersComponent extends BasePageComponent {
    protected unitOfWork: IUnitOfWork;

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        const element = this.shadow.querySelector("#tempElement");

        if (element) {
            let dbVersion = this.unitOfWork.repo(DatabaseVersion).first() ?? new DatabaseVersion(0, "0");
            element.textContent = `Database Version: ${dbVersion?.version}`;
        }

        this.populateCustomSelectElement();

        (this.shadow.querySelector("#testCustomSelect") as CustomSelectComponent).onChange =
            this.handleCustomSelectComponentItemChanged;

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

    private populateCustomSelectElement() {
        const element = this.shadow.querySelector("#testCustomSelect") as CustomSelectComponent;
        const options = [new SelectOption("7", "Theta"), new SelectOption("8", "Phi"), new SelectOption("9", "Pie")];

        element.populateOptions(options);
    }

    public handleOnSelectChanged(event: Event) {
        const selectedValue = (event.target as HTMLSelectElement).value;

        (this.shadow.querySelector("#selectedValue") as HTMLParagraphElement).textContent = selectedValue;
    }

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

        this.updateSelectedItem(event.target as HTMLDivElement);
        this.updateActiveItem(event.target as HTMLDivElement);
        this.closeMenu();
    }

    private updateSelectedItem(clickedElement: HTMLDivElement) {
        const selectedItemElement = this.shadow.querySelector("#selectedItem") as HTMLSpanElement;
        const selectedItemInputElement = this.shadow.querySelector("#inputSelectedItem") as HTMLInputElement;

        selectedItemElement.innerText = clickedElement.innerText;
        selectedItemInputElement.value = clickedElement.getAttribute("data-value") ?? "";

        (this.shadow.querySelector("#selectedValue") as HTMLParagraphElement).textContent =
            clickedElement.getAttribute("data-value") ?? "";
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

    public handleCustomSelectComponentItemChanged = (newValue: SelectOption) => {
        (this.shadow.querySelector("#selectedValue") as HTMLParagraphElement).textContent = newValue.value;
    };
}

customElements.define("characters-page", CharactersComponent);
