import { SortDirection } from "../../sorting/sort-direction";
import { SortState } from "../../sorting/sort-state";

export class SortListFeature {
    private readonly validFields: string[];

    constructor(validFields: string[]) {
        this.validFields = validFields;
    }

    protected isValidField(field: string): boolean {
        if (field === "") return false;

        return this.validFields.find((validField) => validField === field) !== undefined;
    }

    protected sortByStringField(a: string, b: string, sortState: SortState): number {
        if (sortState.direction === SortDirection.Ascending) return a.toLowerCase().localeCompare(b.toLowerCase());

        return b.toLowerCase().localeCompare(a.toLowerCase());
    }

    protected sortByNumberField(a: number, b: number, sortState: SortState): number {
        if (sortState.direction === SortDirection.Ascending) return a - b;

        return b - a;
    }
}
