import html from "./characters.html";
import { BasePageComponent } from "../base-page.component";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { DatabaseVersion } from "../../../features/database-versions/database-version";
import { EventBus } from "../../../lib/events/event-bus";

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

    public handleCustomSelectComponentItemChanged(event: Event) {
        (this.shadow.querySelector("#selectedValue") as HTMLParagraphElement).textContent = (
            event.target as HTMLOptionElement
        ).value;
    }
}

customElements.define("characters-page", CharactersComponent);
