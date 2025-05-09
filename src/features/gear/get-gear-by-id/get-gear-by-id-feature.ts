import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearItem } from "../gear-item";
import { WeaponItem } from "../weapon-item";
import { GetGearByIdRequest } from "./get-gear-by-id-request";

export class GetGearByIdFeature implements IFeature<GetGearByIdRequest, GearItem> {
    private unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: GetGearByIdRequest): GearItem {
        let foundItem: GearItem | undefined;

        if (request.category === ArmorItem.gearCategory) {
            foundItem = this.unitOfWork
                .repo(ArmorItem)
                .list()
                .find((item) => item.id === request.id);
        } else if (request.category === EquipmentItem.gearCategory) {
            foundItem = this.unitOfWork
                .repo(EquipmentItem)
                .list()
                .find((item) => item.id === request.id);
        } else if (request.category === WeaponItem.gearCategory) {
            foundItem = this.unitOfWork
                .repo(WeaponItem)
                .list()
                .find((item) => item.id === request.id);
        }

        return foundItem ?? new GearItem();
    }
}
