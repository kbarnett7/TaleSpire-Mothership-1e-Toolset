import armorData from "./json/armor.data.json";
import equipmentData from "./json/equipment.data.json";
import weaponData from "./json/weapon.data.json";
import npcData from "./json/npc.data.json";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { IDatabase } from "../../src/lib/common/data-access/database-interface";
import { DbSet } from "../../src/lib/common/data-access/db-set";
import { Constructor } from "../../src/lib/common/types/constructor-type";
import { Npc } from "../../src/features/npcs/npc";

export class UnitTestDatabase implements IDatabase {
    private _dbSets: Map<string, DbSet<any>>;

    constructor() {
        this._dbSets = new Map<string, DbSet<any>>();
        this._dbSets.set(ArmorItem.name, new DbSet<ArmorItem>(armorData));
        this._dbSets.set(EquipmentItem.name, new DbSet<EquipmentItem>(equipmentData));
        this._dbSets.set(WeaponItem.name, new DbSet<WeaponItem>(weaponData));
        this._dbSets.set(Npc.name, new DbSet<Npc>(npcData));
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
