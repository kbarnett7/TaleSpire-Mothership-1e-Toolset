import html from "./floating-add-new-entity-button.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { AddNewEntityButtonClicked } from "../../lib/events/add-new-entity-button-clicked";

export class FloatingAddNewEntityButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    public onAddButtonClick(event: MouseEvent) {
        EventBus.instance.dispatch(new AddNewEntityButtonClicked());
    }
}

customElements.define("floating-add-new-entity-button", FloatingAddNewEntityButtonComponent);
