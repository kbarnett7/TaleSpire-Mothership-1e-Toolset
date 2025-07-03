import armorData from "./json/armor.data.json";
import equipmentData from "./json/equipment.data.json";
import weaponData from "./json/weapon.data.json";
import npcData from "./json/npc.data.json";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { IDatabaseContext } from "../../src/lib/common/data-access/database-context-interface";
import { DbSet } from "../../src/lib/common/data-access/db-set";
import { Constructor } from "../../src/lib/common/types/constructor-type";
import { Npc } from "../../src/features/npcs/npc";

export class UnitTestDatabase implements IDatabaseContext {
    private _dbSets: Map<string, DbSet<any>>;

    constructor() {
        this._dbSets = new Map<string, DbSet<any>>();
        this._dbSets.set(
            ArmorItem.name,
            new DbSet<ArmorItem>(armorData.map((obj) => Object.assign(new ArmorItem(), obj)))
        );
        this._dbSets.set(
            EquipmentItem.name,
            new DbSet<EquipmentItem>(equipmentData.map((obj) => Object.assign(new EquipmentItem(), obj)))
        );
        this._dbSets.set(
            WeaponItem.name,
            new DbSet<WeaponItem>(weaponData.map((obj) => Object.assign(new WeaponItem(), obj)))
        );
        this._dbSets.set(Npc.name, new DbSet<Npc>(npcData.map((obj) => Object.assign(new Npc(), obj))));
    }

    public async initializeAsync(connectionString: string): Promise<void> {}

    public getSet<T>(type: Constructor<T>): DbSet<T> {
        const typeName = type.name;
        const dbSet = this._dbSets.get(typeName);

        if (dbSet) {
            return dbSet as DbSet<T>;
        }

        throw new Error(`DbSet of type ${typeName} not found.`);
    }
}
