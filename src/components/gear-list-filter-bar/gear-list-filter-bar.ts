import html from "./gear-list-filter-bar.html";
import { BaseComponent } from "../base.component";

export class GearListFilterBarComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        const { shadowRoot } = this;

        if (!shadowRoot) return;
    }

    public onCategoryButtonClick(event: MouseEvent) {
        const target = event.target as HTMLButtonElement;
        const testEvent = new CustomEvent("test-event", {
            detail: { category: target.id },
            bubbles: true, // Allow the event to bubble up
            composed: true, // Allow the event to pass through shadow DOM boundaries
        });
        console.log("Button Clicked!", event);
        this.dispatchEvent(testEvent);
    }
}

customElements.define("gear-list-filter-bar", GearListFilterBarComponent);
