import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../base.component";
import { GearCategoryChangedEvent } from "../../lib/events/gear-category-changed-event";
import { EventBus } from "../../lib/events/event-bus";

export class GearListFilterBarComponent extends BaseComponent {
    private readonly activeButtonCssClass = "active-filter-button";
    private readonly inactiveButtonCssClass = "inactive-filter-button";

    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    public onCategoryButtonClick(event: MouseEvent) {
        const target = event.target as HTMLButtonElement;

        const appEvent = new GearCategoryChangedEvent(target.id.replace("category", ""));

        EventBus.instance.dispatch(appEvent);

        const allButtons = this.shadow.querySelectorAll("button");

        allButtons.forEach((button) => {
            if (button.id === target.id) {
                button.classList.remove(this.inactiveButtonCssClass);
                button.classList.add(this.activeButtonCssClass);
            } else {
                button.classList.add(this.inactiveButtonCssClass);
                button.classList.remove(this.activeButtonCssClass);
            }
        });
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
