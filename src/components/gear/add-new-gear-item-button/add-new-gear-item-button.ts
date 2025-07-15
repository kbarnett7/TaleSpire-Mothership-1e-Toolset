import html from "./add-new-gear-item-button.html";
import { BaseComponent } from "../../base.component";

export class AddNewGearItemButtonComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }

    private onAddNewGearItemButtonClick(event: MouseEvent) {
        const target = event.target as HTMLButtonElement;

        alert("button clicked");
        // const appEvent = new GearFilterChangedEvent(this.activeCategory, this.currentSearch);

        // EventBus.instance.dispatch(appEvent);
    }
}

customElements.define("add-new-gear-item-button", AddNewGearItemButtonComponent);
