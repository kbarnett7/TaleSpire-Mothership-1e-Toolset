import { GearCategory } from "./gear-category";

export class GearItem {
    public id: number;
    public name: string;
    public category: GearCategory;
    public description: string;
    public cost: number;

    constructor(
        id?: number,
        name?: string,
        category?: GearCategory,
        description?: string,
        cost?: number,
    ) {
        this.id = id ?? 0;
        this.name = name ?? "";
        this.category = category ?? GearCategory.Equipment;
        this.description = description ?? "";
        this.cost = cost ?? 0;
    }
}