import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../base.component";
import { GearCategoryChangedEvent } from "../../lib/events/gear-category-changed-event";
import { EventBus } from "../../lib/events/event-bus";

export class GearListFilterBarComponent extends BaseComponent {
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
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
