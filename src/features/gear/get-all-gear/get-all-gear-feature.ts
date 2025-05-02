import { JsonFileDatabase } from "../../../data-access/json-file-database";
import { Repository } from "../../../data-access/repository";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearListItem } from "../gear-list-item";
import { GearListItemMap } from "../gear-list-item-map";

export class GetAllGearFeature {
    public handle(): GearListItem[] {
        const db = new JsonFileDatabase();
        const equipmentRepository = new Repository<EquipmentItem>(EquipmentItem.name, db);
        const armorRepository = new Repository<ArmorItem>(ArmorItem.name, db);

        let gearListItems: GearListItem[] = [];

        gearListItems = gearListItems.concat(equipmentRepository.list().map(GearListItemMap.fromEquipmentItem));
        gearListItems = gearListItems.concat(armorRepository.list().map(GearListItemMap.fromArmorItem));

        return gearListItems;
    }
}
