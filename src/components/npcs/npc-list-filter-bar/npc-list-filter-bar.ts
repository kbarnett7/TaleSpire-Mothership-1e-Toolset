import html from "./npc-list-filter-bar.html";
import { EventBus } from "../../../lib/events/event-bus";
import { NpcFilterChangedEvent } from "../../../lib/events/npc-filter-changed-event";
import { BaseListFilterBarComponent } from "../../base-list-filter-bar/base-list-filter-bar";

export class NpcListFilterBarComponent extends BaseListFilterBarComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
        this.configureSourcesFilter();
    }

    protected dispatchFilterChangedEvent() {
        const appEvent = new NpcFilterChangedEvent(this.currentSearch, this.currentSourceId);

        EventBus.instance.dispatch(appEvent);
    }
}

customElements.define("npc-list-filter-bar", NpcListFilterBarComponent);
