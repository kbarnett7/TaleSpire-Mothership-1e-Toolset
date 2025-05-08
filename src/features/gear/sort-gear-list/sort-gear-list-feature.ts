import { IFeature } from "../../../lib/common/features/feature-interface";
import { Result } from "../../../lib/result/result";
import { SortDirection } from "../../../lib/sorting/sort-direction";
import { SortState } from "../../../lib/sorting/sort-state";
import { GearListItem } from "../gear-list-item";
import { SortGearListRequest } from "./sort-gear-list-request";

export class SortGearListFeature implements IFeature<SortGearListRequest, Result<GearListItem[]>> {
    private readonly fieldId: string = "Id";
    private readonly fieldItem: string = "Item";
    private readonly fieldCost: string = "Cost";
    private readonly fieldCategory: string = "Category";
    private readonly fieldDescription: string = "Description";
    private readonly validFields: string[] = [
        this.fieldId,
        this.fieldItem,
        this.fieldCost,
        this.fieldCategory,
        this.fieldDescription,
    ];

    public handle(request: SortGearListRequest): Result<GearListItem[]> {
        if (!this.isValidField(request.sortState.field)) return Result.success(request.gearLisItems);

        const sortedResults = [...request.gearLisItems].sort((a, b) => {
            if (request.sortState.direction === SortDirection.None) {
                return a.id - b.id;
            } else if (request.sortState.field === this.fieldItem) {
                return this.sortByStringField(a.name, b.name, request.sortState);
            } else if (request.sortState.field === this.fieldCost) {
                return this.sortByNumberField(a.cost, b.cost, request.sortState);
            } else if (request.sortState.field === this.fieldCategory) {
                return this.sortByStringField(a.category, b.category, request.sortState);
            } else if (request.sortState.field === this.fieldDescription) {
                return this.sortByStringField(a.description, b.description, request.sortState);
            } else {
                return this.sortByNumberField(a.id, b.id, request.sortState);
            }
        });

        return Result.success(sortedResults);
    }

    private isValidField(field: string): boolean {
        if (field === "") return false;

        return this.validFields.find((validField) => validField === field) !== undefined;
    }

    private sortByStringField(a: string, b: string, sortState: SortState): number {
        if (sortState.direction === SortDirection.Ascending) return a.toLowerCase().localeCompare(b.toLowerCase());

        return b.toLowerCase().localeCompare(a.toLowerCase());
    }

    private sortByNumberField(a: number, b: number, sortState: SortState): number {
        if (sortState.direction === SortDirection.Ascending) return a - b;

        return b - a;
    }
}
