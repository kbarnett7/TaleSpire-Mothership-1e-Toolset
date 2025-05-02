import { JsonFileDatabase } from "../../../data-access/json-file-database";
import { UnitOfWork } from "../../../data-access/unit-of-work";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearListItem } from "../gear-list-item";
import { GearListItemMap } from "../gear-list-item-map";

export class GetAllGearFeature {
    public handle(): GearListItem[] {
        const db = new JsonFileDatabase();
        const unitOfWork = new UnitOfWork(db);
        let gearListItems: GearListItem[] = [];

        gearListItems = gearListItems.concat(
            unitOfWork.repo<EquipmentItem>(EquipmentItem.name).list().map(GearListItemMap.fromEquipmentItem)
        );

        gearListItems = gearListItems.concat(
            unitOfWork.repo<ArmorItem>(ArmorItem.name).list().map(GearListItemMap.fromArmorItem)
        );

        return gearListItems;
    }
}
