import html from "./npcs.html";
import { BasePageComponent } from "../base-page.component";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { AddNewEntityButtonClicked } from "../../../lib/events/add-new-entity-button-clicked";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";

export class NpcsComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        EventBus.instance.register(AddNewEntityButtonClicked.name, this.onAddNewNpcButtonClick);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(AddNewEntityButtonClicked.name, this.onAddNewNpcButtonClick);
    }

    private onAddNewNpcButtonClick: AppEventListener = (event: AppEvent) => {
        PageRouterService.instance.navigateToPage(PageRouterService.npcPage, "0");
    };
}

customElements.define("npcs-page", NpcsComponent);
