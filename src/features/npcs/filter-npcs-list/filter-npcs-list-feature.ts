import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { FilterListFeature } from "../../../lib/common/features/filter-list-feature";
import { Result } from "../../../lib/result/result";
import { Source } from "../../sources/source";
import { GetAllNpcsFeature } from "../get-all-npcs/get-all-npcs-feature";
import { NpcListItem } from "../npc-list-item";
import { FilterNpcsListRequest } from "./filter-npcs-list-request";

export class FilterNpcsListFeature
    extends FilterListFeature
    implements IFeature<FilterNpcsListRequest, Result<NpcListItem[]>>
{
    private readonly getAllItemsFeature: GetAllNpcsFeature;

    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
        this.getAllItemsFeature = new GetAllNpcsFeature(this.unitOfWork);
    }

    public handle(request: FilterNpcsListRequest): Result<NpcListItem[]> {
        try {
            let filteredItems: NpcListItem[] = this.getAllItemsFeature.handle(new EmptyRequest());

            filteredItems = this.applySearchFilter<NpcListItem>(filteredItems, request.search, this.getSearchField);
            filteredItems = this.applySourceFilter(filteredItems, request.sourceId);

            return Result.success(filteredItems);
        } catch (error) {
            return this.returnErrorResult<NpcListItem[]>(error as Error, "NPCs");
        }
    }

    private getSearchField(item: NpcListItem): string {
        return item.name;
    }

    private applySourceFilter(listItems: NpcListItem[], sourceId: number): NpcListItem[] {
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
