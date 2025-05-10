import html from "./gear-armor-form.html";
import { BaseComponent } from "../base.component";
import { ArmorItem } from "../../features/gear/armor-item";
import { CreditsAbbreviator } from "../../lib/services/credits-abbreviator";

export class GearArmorFormComponent extends BaseComponent {
    private armorItem: ArmorItem;

    constructor() {
        super();
        this.armorItem = new ArmorItem();
    }

    public connectedCallback() {
        this.render(html);
    }

    public setEquipmentItem(equipmentItem: ArmorItem) {
        this.armorItem = equipmentItem;

        this.updateGearName();
        this.updateGearDescription();
        this.updateGearCost();
    }

    private updateGearName() {
        const paragraph = this.shadow.querySelector("#gearName") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.name;
    }

    private updateGearDescription() {
        const paragraph = this.shadow.querySelector("#gearDescription") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.description;
    }

    private updateGearCost() {
        const paragraph = this.shadow.querySelector("#gearCost") as HTMLParagraphElement;
        paragraph.textContent = CreditsAbbreviator.instance.abbreviate(this.armorItem.cost);
    }
}

customElements.define("gear-armor-form", GearArmorFormComponent);
