import { IUnitOfWork } from "../../../data-access/contracts/unit-of-work-interface";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearListItem } from "../gear-list-item";
import { GearListItemMap } from "../gear-list-item-map";

export class GetAllGearFeature {
    private unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(): GearListItem[] {
        let gearListItems: GearListItem[] = [];

        gearListItems = gearListItems.concat(
            this.unitOfWork.repo(EquipmentItem).list().map(GearListItemMap.fromEquipmentItem)
        );

        gearListItems = gearListItems.concat(this.unitOfWork.repo(ArmorItem).list().map(GearListItemMap.fromArmorItem));

        return gearListItems;
    }
}
