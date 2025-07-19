import html from "./gear-weapon-display.html";
import { BaseComponent } from "../../base.component";
import { WeaponItem } from "../../../features/gear/weapon-item";
import { CreditsAbbreviator } from "../../../lib/services/credits-abbreviator";

export class GearWeaponDisplayComponent extends BaseComponent {
    private weaponItem: WeaponItem;

    constructor() {
        super();
        this.weaponItem = new WeaponItem();
    }

    public connectedCallback() {
        this.render(html);
    }

    public setEquipmentItem(weaponItem: WeaponItem) {
        this.weaponItem = weaponItem;

        this.updateGearName();
        this.updateGearDescription();
        this.updateGearCost();
        this.updateGearRange();
        this.updateGearDamage();
        this.updateGearShots();
        this.updateGearWound();
        this.updateGearSpecial();
    }

    private updateGearName() {
        const paragraph = this.shadow.querySelector("#gearName") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.name;
    }

    private updateGearDescription() {
        const paragraph = this.shadow.querySelector("#gearDescription") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.description;
    }

    private updateGearCost() {
        const paragraph = this.shadow.querySelector("#gearCost") as HTMLParagraphElement;
        paragraph.textContent = CreditsAbbreviator.instance.abbreviate(this.weaponItem.cost);
    }

    private updateGearRange() {
        const paragraph = this.shadow.querySelector("#gearRange") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.range;
    }

    private updateGearDamage() {
        const paragraph = this.shadow.querySelector("#gearDamage") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.damage;
    }

    private updateGearShots() {
        const paragraph = this.shadow.querySelector("#gearShots") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.shots.toString();
    }

    private updateGearWound() {
        const paragraph = this.shadow.querySelector("#gearWound") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.wound;
    }

    private updateGearSpecial() {
        const paragraph = this.shadow.querySelector("#gearSpecial") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.special;
    }
}

customElements.define("gear-weapon-display", GearWeaponDisplayComponent);
