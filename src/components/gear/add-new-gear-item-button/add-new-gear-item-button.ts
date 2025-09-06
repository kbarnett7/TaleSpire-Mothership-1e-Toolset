import html from "./add-new-gear-item-button.html";
import { BaseComponent } from "../../base.component";
import { PageRouterService } from "../../../lib/pages/page-router-service";

export class AddNewGearItemButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    public onAddNewGearItemButtonClick(event: MouseEvent) {
        PageRouterService.instance.navigateToPage(PageRouterService.addEditGearPage, "0");
    }
}

customElements.define("add-new-gear-item-button", AddNewGearItemButtonComponent);
