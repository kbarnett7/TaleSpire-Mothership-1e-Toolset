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
import { CustomSelectComponent } from "../../custom-select/custom-select";
import { SelectOption } from "../../../lib/selects/select-option";

export class GearListFilterBarComponent extends BaseComponent {
    private readonly activeButtonCssClass = "active-filter-button";
    private readonly inactiveButtonCssClass = "inactive-filter-button";

    private unitOfWork: IUnitOfWork;

    private activeCategory: string;
    private currentSearch: string;
    private currentSourceId: number;

    public get sourcesSelectElement(): CustomSelectComponent {
        return this.shadow.querySelector("#sourcesFilter") as CustomSelectComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.activeCategory = GearItem.gearCategory;
        this.currentSearch = "";
        this.currentSourceId = 0;
    }

    public connectedCallback() {
        this.render(html);

        this.populateSourcesFilter();

        this.sourcesSelectElement.onOptionChange = this.handleOnSourcesSelectChanged;

        EventBus.instance.register(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    private handleGearCategoryChangedEvent: AppEventListener = (event: AppEvent) => {
        const gearCategoryChangedEvent = event as GearCategoryChangedEvent;

        this.activeCategory = gearCategoryChangedEvent.category;

        this.dispatchGearFilterChangedEvent();
    };

    public handleOnSearchBoxKeyUp(event: KeyboardEvent) {
        // Ignore shift key up events, otherwise two GearFilterChangedEvents are triggered when
        // typing an UPPERCASE character into the search box.
        if (event.shiftKey === true) return;

        this.currentSearch = (event.target as HTMLInputElement).value;

        this.dispatchGearFilterChangedEvent();
    }

    public handleOnSourcesSelectChanged = (newValue: SelectOption) => {
        const selectedValue = newValue.value;

        this.currentSourceId = parseInt(selectedValue);

        this.dispatchGearFilterChangedEvent();
    };

    private dispatchGearFilterChangedEvent() {
        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch, this.currentSourceId);

        EventBus.instance.dispatch(appEvent);
    }

    private populateSourcesFilter() {
        const sources = this.unitOfWork.repo(Source).list();
        const sourceOptions = [new SelectOption("0", "All")];

        for (let source of sources) {
            sourceOptions.push(new SelectOption(source.id.toString(), source.name));
        }

        this.sourcesSelectElement.populateOptions(sourceOptions);
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
