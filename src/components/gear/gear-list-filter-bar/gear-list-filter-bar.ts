import html from "./gear-list-filter-bar.html";
import { GearFilterChangedEvent } from "../../../lib/events/gear-filter-changed-event";
import { EventBus } from "../../../lib/events/event-bus";
import { GearItem } from "../../../features/gear/gear-item";
import { GearCategoryChangedEvent } from "../../../lib/events/gear-category-changed-event";
import { AppEvent } from "../../../lib/events/app-event";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { BaseListFilterBarComponent } from "../../base-list-filter-bar/base-list-filter-bar";

export class GearListFilterBarComponent extends BaseListFilterBarComponent {
    private readonly activeButtonCssClass = "active-filter-button";
    private readonly inactiveButtonCssClass = "inactive-filter-button";

    private activeCategory: string;

    constructor() {
        super();
        this.activeCategory = GearItem.gearCategory;
    }

    public connectedCallback() {
        this.render(html);
        this.configureSourcesFilter();

        EventBus.instance.register(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    protected dispatchFilterChangedEvent() {
        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch, this.currentSourceId);

        EventBus.instance.dispatch(appEvent);
    }

    private handleGearCategoryChangedEvent: AppEventListener = (event: AppEvent) => {
        const gearCategoryChangedEvent = event as GearCategoryChangedEvent;

        this.activeCategory = gearCategoryChangedEvent.category;

        this.dispatchFilterChangedEvent();
    };
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
