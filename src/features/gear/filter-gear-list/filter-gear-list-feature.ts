import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { FilterListFeature } from "../../../lib/common/features/filter-list-feature";
import { Result } from "../../../lib/result/result";
import { Source } from "../../sources/source";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearListItem } from "../gear-list-item";
import { GetAllGearFeature } from "../get-all-gear/get-all-gear-feature";
import { WeaponItem } from "../weapon-item";
import { FilterGearListRequest } from "./filter-gear-list-request";

export class FilterGearListFeature
    extends FilterListFeature
    implements IFeature<FilterGearListRequest, Result<GearListItem[]>>
{
    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
    }

    public handle(request: FilterGearListRequest): Result<GearListItem[]> {
        try {
            let filteredItems: GearListItem[] = this.applyCategoryFilter(request.category);

            filteredItems = this.applySearchFilter<GearListItem>(filteredItems, request.search, this.getSearchField);
            filteredItems = this.applySourceFilter(filteredItems, request.sourceId);

            return Result.success(filteredItems);
        } catch (error) {
            return this.returnErrorResult<GearListItem[]>(error as Error, "gear");
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

    private getSearchField(item: GearListItem): string {
        return item.name;
    }

    private applySourceFilter(listItems: GearListItem[], sourceId: number): GearListItem[] {
        if (this.isValidSource(sourceId) === false) {
            return listItems;
        }

        return listItems.filter((item) => item.sourceId === sourceId);
    }

    private isValidSource(sourceId: number): boolean {
        return sourceId > 0 && Number.isInteger(sourceId) && this.doesSourceExist(sourceId);
    }

    private doesSourceExist(sourceId: number): boolean {
        const source = this.unitOfWork.repo(Source).first((source) => source.id === sourceId);

        if (!source) {
            return false;
        }

        return true;
    }
}
