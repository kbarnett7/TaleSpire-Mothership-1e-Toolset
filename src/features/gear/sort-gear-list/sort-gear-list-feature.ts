import { IFeature } from "../../../lib/common/features/feature-interface";
import { SortListFeature } from "../../../lib/common/features/sort-list-feature";
import { ErrorCode } from "../../../lib/errors/error-code";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { SortDirection } from "../../../lib/sorting/sort-direction";
import { GearListItem } from "../gear-list-item";
import { SortGearListRequest } from "./sort-gear-list-request";

export class SortGearListFeature
    extends SortListFeature
    implements IFeature<SortGearListRequest, Result<GearListItem[]>>
{
    static fieldId: string = "Id";
    static fieldItem: string = "Item";
    static fieldCost: string = "Cost";
    static fieldCategory: string = "Category";
    static fieldDescription: string = "Description";

    constructor() {
        super([
            SortGearListFeature.fieldId,
            SortGearListFeature.fieldItem,
            SortGearListFeature.fieldCost,
            SortGearListFeature.fieldCategory,
            SortGearListFeature.fieldDescription,
        ]);
    }

    public handle(request: SortGearListRequest): Result<GearListItem[]> {
        try {
            if (!this.isValidField(request.sortState.field)) return Result.success(request.gearListItems);

            const sortedResults = this.sortGearListItems(request);

            return Result.success(sortedResults);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error("Error while sorting gear list", ex);

            return Result.failure(
                new ResultError(
                    ErrorCode.QueryError,
                    `Failed to sort gear item list due to the follow error: ${ex.message}`
                )
            );
        }
    }

    public sortGearListItems(request: SortGearListRequest): GearListItem[] {
        return [...request.gearListItems].sort((a, b) => {
            if (request.sortState.direction === SortDirection.None) {
                return a.id - b.id;
            } else if (request.sortState.field === SortGearListFeature.fieldItem) {
                return this.sortByStringField(a.name, b.name, request.sortState);
            } else if (request.sortState.field === SortGearListFeature.fieldCost) {
                return this.sortByNumberField(a.cost, b.cost, request.sortState);
            } else if (request.sortState.field === SortGearListFeature.fieldCategory) {
                return this.sortByStringField(a.category, b.category, request.sortState);
            } else if (request.sortState.field === SortGearListFeature.fieldDescription) {
                return this.sortByStringField(a.description, b.description, request.sortState);
            } else {
                return this.sortByNumberField(a.id, b.id, request.sortState);
            }
        });
    }
}
