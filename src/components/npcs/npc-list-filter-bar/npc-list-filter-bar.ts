import html from "./npc-list-filter-bar.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { NpcFilterChangedEvent } from "../../../lib/events/npc-filter-changed-event";

export class NpcListFilterBarComponent extends BaseComponent {
    private currentSearch: string;

    constructor() {
        super();
        this.currentSearch = "";
    }

    public connectedCallback() {
        this.render(html);
    }

    private onSearchBoxKeyUp(event: KeyboardEvent) {
        // Ignore shift key up events, otherwise two GearFilterChangedEvents are triggered when
        // typing an UPPERCASE character into the search box.
        if (event.shiftKey === true) return;

        this.currentSearch = (event.target as HTMLInputElement).value;

        const appEvent = new NpcFilterChangedEvent(this.currentSearch);

        EventBus.instance.dispatch(appEvent);
    }
}

customElements.define("npc-list-filter-bar", NpcListFilterBarComponent);
