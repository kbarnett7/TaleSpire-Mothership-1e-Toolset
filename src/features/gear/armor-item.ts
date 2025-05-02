import { EquipmentItem } from "./equipment-item";

export class ArmorItem extends EquipmentItem {
    public armorPoints: number;
    public oxygen: number;
    public speed: string;
    public special: string;

    constructor(
        id?: number,
        name?: string,
        description?: string,
        cost?: number,
        armorPoints?: number,
        oxygen?: number,
        speed?: string,
        special?: string
    ) {
        super(id, name, description, cost);
        this.armorPoints = armorPoints ?? 0;
        this.oxygen = oxygen ?? 0;
        this.speed = speed ?? "";
        this.special = special ?? "";
    }
}
