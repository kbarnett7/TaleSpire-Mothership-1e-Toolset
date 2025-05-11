import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../base.component";
import { GearFilterChangedEvent } from "../../lib/events/gear-filter-changed-event";
import { EventBus } from "../../lib/events/event-bus";
import { GearItem } from "../../features/gear/gear-item";

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
    }

    private onCategoryButtonClick(event: MouseEvent) {
        const target = event.target as HTMLButtonElement;

        this.activeCategory = target.id.replace("category", "");

        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch);

        EventBus.instance.dispatch(appEvent);

        this.setActiveFilterButton(target.id);
    }

    private setActiveFilterButton(buttonId: string) {
        const allButtons = this.shadow.querySelectorAll("button");

        allButtons.forEach((button) => {
            if (button.id === buttonId) {
                button.classList.remove(this.inactiveButtonCssClass);
                button.classList.add(this.activeButtonCssClass);
            } else {
                button.classList.add(this.inactiveButtonCssClass);
                button.classList.remove(this.activeButtonCssClass);
            }
        });
    }

    private onSearchBoxKeyUp(event: KeyboardEvent) {
        this.currentSearch = (event.target as HTMLInputElement).value;

        const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch);

        EventBus.instance.dispatch(appEvent);
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
