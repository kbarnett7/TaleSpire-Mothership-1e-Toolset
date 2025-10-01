import html from "./gear.component.html";
import { BasePageComponent } from "../base-page.component";
import { EventBus } from "../../../lib/events/event-bus";
import { AddNewEntityButtonClicked } from "../../../lib/events/add-new-entity-button-clicked";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";

export class GearComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        EventBus.instance.register(AddNewEntityButtonClicked.name, this.onAddNewGearItemButtonClick);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(AddNewEntityButtonClicked.name, this.onAddNewGearItemButtonClick);
    }

    private onAddNewGearItemButtonClick: AppEventListener = (event: AppEvent) => {
        PageRouterService.instance.navigateToPage(PageRouterService.gearItemPage, "0");
    };
}

customElements.define("gear-page", GearComponent);
