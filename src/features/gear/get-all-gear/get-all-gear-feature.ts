import { ArmorRepository } from "../armor-repository";
import { EquipmentRepository } from "../equipment-repository";
import { GearListItem } from "../gear-list-item";
import { GearListItemMap } from "../gear-list-item-map";

export class GetAllGearFeature {
    public handle(): GearListItem[] {
        const equipmentRepository = new EquipmentRepository();
        const armorRepository = new ArmorRepository();

        let gearListItems: GearListItem[] = [];

        gearListItems = gearListItems.concat(equipmentRepository.list().map(GearListItemMap.fromEquipmentItem));
        gearListItems = gearListItems.concat(armorRepository.list().map(GearListItemMap.fromArmorItem));

        return gearListItems;
    }
}
