import { JsonFileDatabase } from "../../../data-access/json-file-database";
import { ArmorRepository } from "../armor-repository";
import { EquipmentRepository } from "../equipment-repository";
import { GearListItem } from "../gear-list-item";
import { GearListItemMap } from "../gear-list-item-map";

export class GetAllGearFeature {
    public handle(): GearListItem[] {
        const db = new JsonFileDatabase();
        const equipmentRepository = new EquipmentRepository(db);
        const armorRepository = new ArmorRepository(db);

        let gearListItems: GearListItem[] = [];

        gearListItems = gearListItems.concat(equipmentRepository.list().map(GearListItemMap.fromEquipmentItem));
        gearListItems = gearListItems.concat(armorRepository.list().map(GearListItemMap.fromArmorItem));

        return gearListItems;
    }
}
