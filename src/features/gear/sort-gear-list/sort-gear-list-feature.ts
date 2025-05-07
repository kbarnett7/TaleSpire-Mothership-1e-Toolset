import { IFeature } from "../../../lib/common/features/feature-interface";
import { Result } from "../../../lib/result/result";
import { SortDirection } from "../../../lib/sorting/sort-direction";
import { SortState } from "../../../lib/sorting/sort-state";
import { GearListItem } from "../gear-list-item";
import { SortGearListRequest } from "./sort-gear-list-request";

export class SortGearListFeature implements IFeature<SortGearListRequest, Result<GearListItem[]>> {
    public handle(request: SortGearListRequest): Result<GearListItem[]> {
        if (request.sortState.field === "") return Result.success(request.gearLisItems);

        const sortedResults = [...request.gearLisItems].sort((a, b) => {
            if (request.sortState.direction === SortDirection.None) return this.sortById(a, b);
            else if (request.sortState.field === "Item") return this.sortByName(a, b, request.sortState);
            else return this.sortByCost(a, b, request.sortState);
        });

        return Result.success(sortedResults);
    }

    private sortById(a: GearListItem, b: GearListItem): number {
        return a.id - b.id;
    }

    private sortByName(a: GearListItem, b: GearListItem, sortState: SortState): number {
        if (sortState.direction === SortDirection.Ascending)
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());

        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
    }

    private sortByCost(a: GearListItem, b: GearListItem, sortState: SortState): number {
        if (sortState.direction === SortDirection.Ascending) return a.cost - b.cost;

        return b.cost - a.cost;
    }
}
