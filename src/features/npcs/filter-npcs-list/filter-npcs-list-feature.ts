import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { GetAllNpcsFeature } from "../get-all-npcs/get-all-npcs-feature";
import { NpcListItem } from "../npc-list-item";
import { FilterNpcsListRequest } from "./filter-npcs-list-request";

export class FilterNpcsListFeature implements IFeature<FilterNpcsListRequest, Result<NpcListItem[]>> {
    private readonly unitOfWork: IUnitOfWork;
    private readonly getAllItemsFeature: GetAllNpcsFeature;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
        this.getAllItemsFeature = new GetAllNpcsFeature(this.unitOfWork);
    }

    public handle(request: FilterNpcsListRequest): Result<NpcListItem[]> {
        try {
            let filteredItems: NpcListItem[] = this.getAllItemsFeature.handle(new EmptyRequest());

            filteredItems = this.applySearchFilter(filteredItems, request.search);

            return Result.success(filteredItems);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error("Error while filtering NPCs list", ex);

            return Result.failure(
                new ResultError(
                    ErrorCode.QueryError,
                    `Failed to filter NPCs list due to the follow error: ${ex.message}`
                )
            );
        }
    }

    private applySearchFilter(npcsListItems: NpcListItem[], search: string): NpcListItem[] {
        const filter: string = search.trim().toLowerCase();

        if (filter === "") return npcsListItems;

        const escapedFilter = this.escapeRegExpCharacters(filter);
        const searchRegEx = new RegExp(`^.*(${escapedFilter})+.*$`);

        return npcsListItems.filter((item) => item.name.trim().toLowerCase().match(searchRegEx));
    }

    private escapeRegExpCharacters(input: string): string {
        return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special regex characters
    }
}
