import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { Result } from "../../../lib/result/result";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearListItem } from "../gear-list-item";
import { WeaponItem } from "../weapon-item";
import { FilterGearListRequest } from "./filter-gear-list-request";

export class FilterGearListFeature implements IFeature<FilterGearListRequest, Result<GearListItem[]>> {
    private unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: FilterGearListRequest): Result<GearListItem[]> {
        let filteredItems: GearListItem[];

        if (this.isValidGearCategory(request.category)) {
            filteredItems = request.gearItemList.filter((item) => item.category === request.category);
        } else {
            filteredItems = request.gearItemList;
        }

        return Result.success(filteredItems);
    }

    private isValidGearCategory(category: string) {
        const categories: string[] = [ArmorItem.gearCategory, EquipmentItem.gearCategory, WeaponItem.gearCategory];

        return categories.includes(category);
    }
}
