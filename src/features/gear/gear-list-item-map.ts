import { ArmorItem } from "./armor-item";
import { EquipmentItem } from "./equipment-item";
import { GearListItem } from "./gear-list-item";
import { WeaponItem } from "./weapon-item";

export class GearListItemMap {
    static fromArmorItem(item: ArmorItem): GearListItem {
        return new GearListItem(item.id, item.name, item.description, item.cost, ArmorItem.gearCategory);
    }

    static fromEquipmentItem(item: EquipmentItem): GearListItem {
        return new GearListItem(item.id, item.name, item.description, item.cost, EquipmentItem.gearCategory);
    }

    static fromWeaponItem(item: WeaponItem): GearListItem {
        return new GearListItem(item.id, item.name, item.description, item.cost, WeaponItem.gearCategory);
    }
}
