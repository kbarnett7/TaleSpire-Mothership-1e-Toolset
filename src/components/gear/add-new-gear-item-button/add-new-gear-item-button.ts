import html from "./add-new-gear-item-button.html";
import { BaseComponent } from "../../base.component";
import { PageChangeInitiatedEvent } from "../../../lib/events/page-change-initiated-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { EventBus } from "../../../lib/events/event-bus";

export class AddNewGearItemButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    public onAddNewGearItemButtonClick(event: MouseEvent) {
        const target = event.target as HTMLButtonElement;

        this.navigateToAddEditPage();
    }

    private navigateToAddEditPage() {
        const pageChangeInitiatedEvent = new PageChangeInitiatedEvent(
            PageRouterService.instance.getPageByTitle(PageRouterService.addEditGearPage),
            "0"
        );

        EventBus.instance.dispatch(pageChangeInitiatedEvent);
    }
}

customElements.define("add-new-gear-item-button", AddNewGearItemButtonComponent);
