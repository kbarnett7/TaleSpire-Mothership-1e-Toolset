import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearListItem } from "../gear-list-item";
import { GearListItemMap } from "../gear-list-item-map";
import { WeaponItem } from "../weapon-item";

export class GetAllGearFeature implements IFeature<EmptyRequest, GearListItem[]> {
    private unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: EmptyRequest): GearListItem[] {
        let gearListItems: GearListItem[] = [];

        gearListItems = gearListItems.concat(
            this.unitOfWork.repo(EquipmentItem).list().map(GearListItemMap.fromEquipmentItem)
        );

        gearListItems = gearListItems.concat(this.unitOfWork.repo(ArmorItem).list().map(GearListItemMap.fromArmorItem));
        gearListItems = gearListItems.concat(
            this.unitOfWork.repo(WeaponItem).list().map(GearListItemMap.fromWeaponItem)
        );

        return gearListItems;
    }
}
