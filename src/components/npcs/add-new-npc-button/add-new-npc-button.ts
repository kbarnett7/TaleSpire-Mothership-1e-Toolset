import html from "./add-new-npc-button.html";
import { BaseComponent } from "../../base.component";
import { PageRouterService } from "../../../lib/pages/page-router-service";

export class AddNewNpcButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    public onAddNewNpcButtonClick(event: MouseEvent) {
        PageRouterService.instance.navigateToPage(PageRouterService.npcPage, "0");
    }
}

customElements.define("add-new-npc-button", AddNewNpcButtonComponent);
