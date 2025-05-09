import html from "./gear-equipment-form.html";
import { BaseComponent } from "../base.component";

export class GearEquipmentForm extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
    }
}

customElements.define("gear-equipment-form", GearEquipmentForm);
