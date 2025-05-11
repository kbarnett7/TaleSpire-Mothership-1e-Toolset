import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { AppLogger } from "../../../lib/logging/app-logger";
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

            AppLogger.instance.error("Error while filtering gear list", ex);

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
        const filter: string = search.trim().toLowerCase();

        if (filter === "") return gearLisItems;

        const escapedFilter = this.escapeRegExpCharacters(filter);
        const searchRegEx = new RegExp(`^.*(${escapedFilter})+.*$`);

        return gearLisItems.filter((item) => item.name.trim().toLowerCase().match(searchRegEx));
    }

    private escapeRegExpCharacters(input: string): string {
        return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special regex characters
    }
}
