import { GearItem } from "../gear-item";

export class FilterGearListRequest {
    public category: string = GearItem.gearCategory;
    public search: string = "";
}
