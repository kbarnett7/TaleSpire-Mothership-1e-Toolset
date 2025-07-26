import html from "./gear-weapon-form-fields.html";
import { BaseComponent } from "../../base.component";
import { WeaponItem } from "../../../features/gear/weapon-item";

export class GearWeaponFormFieldsComponent extends BaseComponent {
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

        this.updateGearRange();
        this.updateGearDamage();
        this.updateGearShots();
        this.updateGearWound();
        this.updateGearSpecial();
    }

    private updateGearRange() {
        const paragraph = this.shadow.querySelector("#inputRange") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.range;
    }

    private updateGearDamage() {
        const paragraph = this.shadow.querySelector("#inputDamage") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.damage;
    }

    private updateGearShots() {
        const paragraph = this.shadow.querySelector("#inputShots") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.shots.toString();
    }

    private updateGearWound() {
        const paragraph = this.shadow.querySelector("#inputWound") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.wound;
    }

    private updateGearSpecial() {
        const paragraph = this.shadow.querySelector("#inputSpecial") as HTMLParagraphElement;
        paragraph.textContent = this.weaponItem.special;
    }
}

customElements.define("gear-weapon-form-fields", GearWeaponFormFieldsComponent);
