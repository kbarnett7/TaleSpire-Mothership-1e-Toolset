import { EquipmentItem } from "./equipment-item";
import { WeaponCategory } from "./weapon-category";
import { WeaponRange } from "./weapon-range";

export class WeaponItem extends EquipmentItem {
    public static gearCategory: string = "Weapon";

    public category: string;
    public range: string;
    public damage: string;
    public shots: number;
    public wound: string;
    public special: string;

    constructor(
        id?: number,
        sourceId?: number,
        name?: string,
        description?: string,
        cost?: number,
        category?: string,
        range?: string,
        damage?: string,
        shots?: number,
        wound?: string,
        special?: string
    ) {
        super(id, sourceId, name, description, cost);
        this.category = category ?? WeaponCategory.Melee;
        this.range = range ?? WeaponRange.Adjacent;
        this.damage = damage ?? "";
        this.shots = shots ?? 0;
        this.wound = wound ?? "";
        this.special = special ?? "";
    }
}
