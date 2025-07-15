import html from "./add-edit-gear.html";
import { BasePageComponent } from "../base-page.component";
import { EventBus } from "../../../lib/events/event-bus";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { ShowNavigateBackButtonEvent } from "../../../lib/events/show-navigate-back-button-event";
import { HideNavigateBackButtonEvent } from "../../../lib/events/hide-navigate-back-button-event";

export class AddEditGearComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        this.dispatchShowNavigateBackButtonEvent();
    }

    public disconnectedCallback() {
        this.dispatchHideNavigateBackButtonEvent();
    }

    private dispatchShowNavigateBackButtonEvent() {
        const showNavigateBackButtonEvent = new ShowNavigateBackButtonEvent(
            PageRouterService.instance.getPageByTitle(PageRouterService.gearPage).path
        );

        EventBus.instance.dispatch(showNavigateBackButtonEvent);
    }

    private dispatchHideNavigateBackButtonEvent() {
        const hideNavigateBackButtonEvent = new HideNavigateBackButtonEvent();

        EventBus.instance.dispatch(hideNavigateBackButtonEvent);
    }
}

customElements.define("add-edit-gear-page", AddEditGearComponent);
