import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../base.component";
import { GearCategoryChangedEvent } from "../../lib/events/gear-category-changed-event";
import { EventService } from "../../lib/events/event-service";

export class GearListFilterBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        const { shadowRoot } = this;

        if (!shadowRoot) return;
    }

    public onCategoryButtonClick(event: MouseEvent) {
        const target = event.target as HTMLButtonElement;

        const appEvent = new GearCategoryChangedEvent(target.id.replace("category", ""));

        EventService.instance.dispatchEvent(appEvent);
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
