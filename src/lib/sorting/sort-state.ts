import { SortDirection } from "./sort-direction";

export class SortState {
    private _field: string = "";
    private _direction: SortDirection = SortDirection.None;

    public get field(): string {
        return this._field;
    }

    public get direction(): SortDirection {
        return this._direction;
    }

    public set(field: string) {
        if (this.field !== field) {
            this._field = field;
            this._direction = SortDirection.None;
        }

        if (this._direction === SortDirection.None) {
            this._direction = SortDirection.Ascending;
        } else if (this._direction === SortDirection.Ascending) {
            this._direction = SortDirection.Descending;
        } else {
            this._direction = SortDirection.None;
        }
    }
}
