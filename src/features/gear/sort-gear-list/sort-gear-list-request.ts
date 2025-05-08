import { SortState } from "../../../lib/sorting/sort-state";
import { GearListItem } from "../gear-list-item";

export class SortGearListRequest {
    public gearListItems: GearListItem[] = [];
    public sortState: SortState = new SortState();
}
