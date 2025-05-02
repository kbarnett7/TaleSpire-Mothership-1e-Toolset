import armorData from "../database/armor.data.json";
import equipmentData from "../database/equipment.data.json";
import { ArmorItem } from "../features/gear/armor-item";
import { EquipmentItem } from "../features/gear/equipment-item";
import { IDatabase } from "./database-interface";
import { DbSet } from "./db-set";

export class JsonFileDatabase implements IDatabase {
    private _dbSets: { key: string; value: DbSet<any> }[] = [];

    constructor() {
        this._dbSets = [];
        this._dbSets.push({ key: ArmorItem.name, value: new DbSet<ArmorItem>(armorData) });
        this._dbSets.push({ key: EquipmentItem.name, value: new DbSet<EquipmentItem>(equipmentData) });
    }

    getSet<T>(type: string): DbSet<T> {
        const dbSet = this._dbSets.find((dbSet) => dbSet.key === type);

        if (dbSet) {
            return dbSet.value as DbSet<T>;
        }

        throw new Error(`DbSet of type ${type} not found.`);
    }
}
