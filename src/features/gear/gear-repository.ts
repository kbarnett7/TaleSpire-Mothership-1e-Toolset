import { GearCategory } from "./gear-category";
import { GearItem } from "./gear-item";

export class GearRepository {
    constructor() {

    }

    public list(): GearItem[] {
        return [
            new GearItem(1, "Basic Armor", GearCategory.Armor, "A basic armor for protection.", 100),
            new GearItem(2, "Advanced Armor", GearCategory.Armor, "An advanced armor with better protection.", 200),
            new GearItem(3, "Basic Weapon", GearCategory.Weapon, "A basic weapon for combat.", 150),
            new GearItem(4, "Advanced Weapon", GearCategory.Weapon, "An advanced weapon with better damage.", 300),
            new GearItem(5, "Basic Equipment", GearCategory.Equipment, "Basic equipment for various tasks.", 50),
            new GearItem(6, "Advanced Equipment", GearCategory.Equipment, "Advanced equipment for specialized tasks.", 120),
        ];
    }
}