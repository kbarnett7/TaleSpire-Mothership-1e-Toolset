import html from "./add-new-gear-item-button.html";
import { BaseComponent } from "../../base.component";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
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
        const changePageEvent = new ChangePageEvent(
            PageRouterService.instance.getPageByTitle(PageRouterService.addEditGearPage)
        );

        EventBus.instance.dispatch(changePageEvent);
    }
}

customElements.define("add-new-gear-item-button", AddNewGearItemButtonComponent);
