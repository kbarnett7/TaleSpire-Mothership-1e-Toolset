import { GearItem } from "../gear-item";
import { GearListItem } from "../gear-list-item";

export class FilterGearListRequest {
    public gearItemList: GearListItem[] = [];
    public category: string = GearItem.gearCategory;
}
