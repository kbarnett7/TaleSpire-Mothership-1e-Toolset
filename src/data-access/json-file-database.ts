import { Constructor } from "../common/types/constructor-type";
import { ArmorItem } from "../features/gear/armor-item";
import { EquipmentItem } from "../features/gear/equipment-item";
import { IDatabase } from "../common/data-access/database-interface";
import { DbSet } from "../common/data-access/db-set";
import { WeaponItem } from "../features/gear/weapon-item";
import armorData from "../database/json/armor.data.json";
import equipmentData from "../database/json/equipment.data.json";
import weaponData from "../database/json/weapon.data.json";

export class JsonFileDatabase implements IDatabase {
    private _dbSets: Map<string, DbSet<any>>;

    constructor() {
        this._dbSets = new Map<string, DbSet<any>>();
        this._dbSets.set(ArmorItem.name, new DbSet<ArmorItem>(armorData));
        this._dbSets.set(EquipmentItem.name, new DbSet<EquipmentItem>(equipmentData));
        this._dbSets.set(WeaponItem.name, new DbSet<WeaponItem>(weaponData));
    }

    getSet<T>(type: Constructor<T>): DbSet<T> {
        const typeName = type.name;
        const dbSet = this._dbSets.get(typeName);

        if (dbSet) {
            return dbSet as DbSet<T>;
        }

        throw new Error(`DbSet of type ${typeName} not found.`);
    }
}
