import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../../base.component";
import { GearFilterChangedEvent } from "../../../lib/events/gear-filter-changed-event";
import { EventBus } from "../../../lib/events/event-bus";
import { GearItem } from "../../../features/gear/gear-item";
import { GearCategoryChangedEvent } from "../../../lib/events/gear-category-changed-event";
import { AppEvent } from "../../../lib/events/app-event";

export class GearListFilterBarComponent extends BaseComponent {
    private readonly activeButtonCssClass = "active-filter-button";
    private readonly inactiveButtonCssClass = "inactive-filter-button";

    private activeCategory: string;
    private currentSearch: string;

    constructor() {
        super();
        this.activeCategory = GearItem.gearCategory;
        this.currentSearch = "";
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    private handleGearCategoryChangedEvent(event: AppEvent) {
        const gearCategoryChangedEvent = event as GearCategoryChangedEvent;
        //const target = event.target as HTMLButtonElement;

        //this.activeCategory = target.id.replace("category", "");
        this.activeCategory = gearCategoryChangedEvent.category;

        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch);

        EventBus.instance.dispatch(appEvent);

        //this.setActiveFilterButton(`category${gearCategoryChangedEvent.category}`);
    }

    // private setActiveFilterButton(buttonId: string) {
    //     const allButtons = this.shadow.querySelectorAll("button");

    //     allButtons.forEach((button) => {
    //         if (button.id === buttonId) {
    //             button.classList.remove(this.inactiveButtonCssClass);
    //             button.classList.add(this.activeButtonCssClass);
    //         } else {
    //             button.classList.add(this.inactiveButtonCssClass);
    //             button.classList.remove(this.activeButtonCssClass);
    //         }
    //     });
    // }

    private onSearchBoxKeyUp(event: KeyboardEvent) {
        // Ignore shift key up events, otherwise two GearFilterChangedEvents are triggered when
        // typing an UPPERCASE character into the search box.
        if (event.shiftKey === true) return;

        this.currentSearch = (event.target as HTMLInputElement).value;

        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch);

        EventBus.instance.dispatch(appEvent);
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
