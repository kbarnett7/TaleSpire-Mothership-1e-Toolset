import armorData from "../database/armor.data.json";
import equipmentData from "../database/equipment.data.json";
import { ArmorItem } from "../features/gear/armor-item";
import { EquipmentItem } from "../features/gear/equipment-item";
import { IDatabase } from "./database-interface";
import { DbSet } from "./db-set";

export class JsonFileDatabase implements IDatabase {
    private _dbSets: Map<string, DbSet<any>>;

    constructor() {
        this._dbSets = new Map<string, DbSet<any>>();
        this._dbSets.set(ArmorItem.name, new DbSet<ArmorItem>(armorData));
        this._dbSets.set(EquipmentItem.name, new DbSet<EquipmentItem>(equipmentData));
    }

    getSet<T>(type: string): DbSet<T> {
        const dbSet = this._dbSets.get(type);

        if (dbSet) {
            return dbSet as DbSet<T>;
        }

        throw new Error(`DbSet of type ${type} not found.`);
    }
}
