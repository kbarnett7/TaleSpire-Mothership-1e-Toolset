import html from "./gear-categories-pill-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { GearItem } from "../../../features/gear/gear-item";
import { GearCategoryChangedEvent } from "../../../lib/events/gear-category-changed-event";

export class GearCategoriesPillBarComponent extends BaseComponent {
    private readonly activeButtonCssClass = "active-filter-button";
    private readonly inactiveButtonCssClass = "inactive-filter-button";

    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    private onCategoryButtonClick(event: MouseEvent) {
        const target = event.target as HTMLButtonElement;

        const category = target.id.replace("category", "");

        const appEvent = new GearCategoryChangedEvent(category);

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
}

customElements.define("gear-categories-pill-bar", GearCategoriesPillBarComponent);
