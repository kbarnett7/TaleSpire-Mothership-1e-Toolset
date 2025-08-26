import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../../base.component";
import { GearFilterChangedEvent } from "../../../lib/events/gear-filter-changed-event";
import { EventBus } from "../../../lib/events/event-bus";
import { GearItem } from "../../../features/gear/gear-item";
import { GearCategoryChangedEvent } from "../../../lib/events/gear-category-changed-event";
import { AppEvent } from "../../../lib/events/app-event";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { Source } from "../../../features/sources/source";

export class GearListFilterBarComponent extends BaseComponent {
    private readonly activeButtonCssClass = "active-filter-button";
    private readonly inactiveButtonCssClass = "inactive-filter-button";

    private unitOfWork: IUnitOfWork;

    private activeCategory: string;
    private currentSearch: string;

    public get sourcesSelectElement(): HTMLSelectElement {
        return this.shadow.querySelector("#sourcesFilter") as HTMLSelectElement;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.activeCategory = GearItem.gearCategory;
        this.currentSearch = "";
    }

    public connectedCallback() {
        this.render(html);

        this.populateSourcesFilter();

        EventBus.instance.register(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    private handleGearCategoryChangedEvent: AppEventListener = (event: AppEvent) => {
        const gearCategoryChangedEvent = event as GearCategoryChangedEvent;

        this.activeCategory = gearCategoryChangedEvent.category;

        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch);

        EventBus.instance.dispatch(appEvent);
    };

    public handleOnSearchBoxKeyUp(event: KeyboardEvent) {
        // Ignore shift key up events, otherwise two GearFilterChangedEvents are triggered when
        // typing an UPPERCASE character into the search box.
        if (event.shiftKey === true) return;

        this.currentSearch = (event.target as HTMLInputElement).value;

        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch);

        EventBus.instance.dispatch(appEvent);
    }

    public handleOnSourcesSelectChanged(event: Event) {
        const selectedValue = this.sourcesSelectElement.value;
        alert(`Selected: ${selectedValue}`);
    }

    private populateSourcesFilter() {
        const sourcesFilter = this.sourcesSelectElement;

        if (!sourcesFilter) return;

        if (sourcesFilter.hasChildNodes()) {
            sourcesFilter.replaceChildren();
        }

        const sources = this.unitOfWork.repo(Source).list();

        sourcesFilter.appendChild(this.createSourceFilterOption("0", "All"));

        for (let source of sources) {
            sourcesFilter.appendChild(this.createSourceFilterOption(source.id.toString(), source.name));
        }
    }

    private createSourceFilterOption(value: string, text: string): HTMLOptionElement {
        const option = document.createElement("option");

        option.value = value;
        option.text = text;

        return option;
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
