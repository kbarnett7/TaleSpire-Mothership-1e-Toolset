import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { Result } from "../../../lib/result/result";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearListItem } from "../gear-list-item";
import { GetAllGearFeature } from "../get-all-gear/get-all-gear-feature";
import { WeaponItem } from "../weapon-item";
import { FilterGearListRequest } from "./filter-gear-list-request";

export class FilterGearListFeature implements IFeature<FilterGearListRequest, Result<GearListItem[]>> {
    private unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: FilterGearListRequest): Result<GearListItem[]> {
        const getAllGearListItemsFeature = new GetAllGearFeature(this.unitOfWork);
        const allGearListItems = getAllGearListItemsFeature.handle(new EmptyRequest());
        let filteredItems: GearListItem[];

        if (this.isValidGearCategory(request.category)) {
            filteredItems = allGearListItems.filter((item) => item.category === request.category);
        } else {
            filteredItems = allGearListItems;
        }

        return Result.success(filteredItems);
    }

    private isValidGearCategory(category: string) {
        const categories: string[] = [ArmorItem.gearCategory, EquipmentItem.gearCategory, WeaponItem.gearCategory];

        return categories.includes(category);
    }
}
