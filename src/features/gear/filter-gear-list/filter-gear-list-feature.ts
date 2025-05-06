import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
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
        try {
            let filteredItems: GearListItem[] = this.applyCategoryFilter(request.category);

            filteredItems = this.applySearchFilter(filteredItems, request.search);

            return Result.success(filteredItems);
        } catch (error) {
            const ex = error as Error;
            return Result.failure(
                new ResultError(
                    ErrorCode.QueryError,
                    `Failed to filter gear item list due to the follow error: ${ex.message}`
                )
            );
        }
    }

    private applyCategoryFilter(category: string): GearListItem[] {
        const getAllGearListItemsFeature = new GetAllGearFeature(this.unitOfWork);
        const allGearListItems = getAllGearListItemsFeature.handle(new EmptyRequest());

        if (this.isValidGearCategory(category)) {
            return allGearListItems.filter((item) => item.category === category);
        }

        return allGearListItems;
    }

    private isValidGearCategory(category: string) {
        const categories: string[] = [ArmorItem.gearCategory, EquipmentItem.gearCategory, WeaponItem.gearCategory];

        return categories.includes(category);
    }

    private applySearchFilter(gearLisItems: GearListItem[], search: string): GearListItem[] {
        const trimmedSearch: string = search.trim();
        const filteredItems: GearListItem[] = [];

        if (trimmedSearch === "") return gearLisItems;

        const searchRegEx = new RegExp(`^.*(${trimmedSearch})+.*$`);

        gearLisItems.forEach((item) => {
            if (item.name.trim().toLowerCase().match(searchRegEx)) {
                filteredItems.push(item);
            }
        });

        return filteredItems;
    }
}
