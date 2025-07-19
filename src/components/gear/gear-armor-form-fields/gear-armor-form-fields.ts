import html from "./gear-armor-form-fields.html";
import { BaseComponent } from "../../base.component";
import { ArmorItem } from "../../../features/gear/armor-item";

export class GearArmorFormFieldsComponent extends BaseComponent {
    private armorItem: ArmorItem;

    constructor() {
        super();
        this.armorItem = new ArmorItem();
    }

    public connectedCallback() {
        this.render(html);
    }

    public setEquipmentItem(armorItem: ArmorItem) {
        this.armorItem = armorItem;

        this.updateGearArmorPoints();
        this.updateGearOxygen();
        this.updateGearSpeed();
        this.updateGearSpecial();
    }

    private updateGearArmorPoints() {
        const paragraph = this.shadow.querySelector("#inputArmorPoints") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.armorPoints.toString();
    }

    private updateGearOxygen() {
        const paragraph = this.shadow.querySelector("#inputOxygen") as HTMLParagraphElement;

        if (this.armorItem.oxygen === 0) {
            paragraph.textContent = "None";
        } else {
            paragraph.textContent = `${this.armorItem.oxygen} hours`;
        }
    }

    private updateGearSpeed() {
        const paragraph = this.shadow.querySelector("#inputSpeed") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.speed;
    }

    private updateGearSpecial() {
        const paragraph = this.shadow.querySelector("#inputSpecial") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.special;
    }
}

customElements.define("gear-armor-form-fields", GearArmorFormFieldsComponent);
