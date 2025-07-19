import html from "./gear-armor-display.html";
import { BaseComponent } from "../../base.component";
import { ArmorItem } from "../../../features/gear/armor-item";
import { CreditsAbbreviator } from "../../../lib/services/credits-abbreviator";

export class GearArmorDisplayComponent extends BaseComponent {
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

        this.updateGearName();
        this.updateGearDescription();
        this.updateGearCost();
        this.updateGearArmorPoints();
        this.updateGearOxygen();
        this.updateGearSpeed();
        this.updateGearSpecial();
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

    private updateGearArmorPoints() {
        const paragraph = this.shadow.querySelector("#gearArmorPoints") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.armorPoints.toString();
    }

    private updateGearOxygen() {
        const paragraph = this.shadow.querySelector("#gearOxygen") as HTMLParagraphElement;

        if (this.armorItem.oxygen === 0) {
            paragraph.textContent = "None";
        } else {
            paragraph.textContent = `${this.armorItem.oxygen} hours`;
        }
    }

    private updateGearSpeed() {
        const paragraph = this.shadow.querySelector("#gearSpeed") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.speed;
    }

    private updateGearSpecial() {
        const paragraph = this.shadow.querySelector("#gearSpecial") as HTMLParagraphElement;
        paragraph.textContent = this.armorItem.special;
    }
}

customElements.define("gear-armor-display", GearArmorDisplayComponent);
