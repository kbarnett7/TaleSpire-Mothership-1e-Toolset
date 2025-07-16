import html from "./add-edit-gear.html";
import { BasePageComponent } from "../base-page.component";
import { EventBus } from "../../../lib/events/event-bus";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { ShowNavigateBackButtonEvent } from "../../../lib/events/show-navigate-back-button-event";
import { HideNavigateBackButtonEvent } from "../../../lib/events/hide-navigate-back-button-event";

export class AddEditGearComponent extends BasePageComponent {
    private gearItemIdFromUrl: string;

    constructor() {
        super();
        this.gearItemIdFromUrl = "";
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.gearItemIdFromUrl = this.getIdFromUrl();

        this.render(html);

        this.dispatchShowNavigateBackButtonEvent();

        const gearIdElement = this.shadow.querySelector("#gearId") as HTMLSpanElement;
        gearIdElement.textContent = this.gearItemIdFromUrl;
    }

    public disconnectedCallback() {
        this.dispatchHideNavigateBackButtonEvent();
    }

    private dispatchShowNavigateBackButtonEvent() {
        const showNavigateBackButtonEvent = new ShowNavigateBackButtonEvent(
            PageRouterService.instance.getPageByTitle(PageRouterService.gearPage)
        );

        EventBus.instance.dispatch(showNavigateBackButtonEvent);
    }

    private dispatchHideNavigateBackButtonEvent() {
        const hideNavigateBackButtonEvent = new HideNavigateBackButtonEvent();

        EventBus.instance.dispatch(hideNavigateBackButtonEvent);
    }

    private getIdFromUrl(): string {
        const urlComponents = window.location.pathname.split("/");
        return urlComponents[urlComponents.length - 1];
    }
}

customElements.define("add-edit-gear-page", AddEditGearComponent);
