import { GearItem } from "./gear-item";

export class EquipmentItem extends GearItem {
    public static gearCategory: string = "Equipment";

    public description: string;
    public cost: number;

    constructor(id?: number, name?: string, description?: string, cost?: number) {
        super(id, name);
        this.description = description ?? "";
        this.cost = cost ?? 0;
    }
}
