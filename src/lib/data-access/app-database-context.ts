import armorData from "../../database/json/armor.data.json";
import equipmentData from "../../database/json/equipment.data.json";
import weaponData from "../../database/json/weapon.data.json";
import npcData from "../../database/json/npcs.data.json";
import { Constructor } from "../common/types/constructor-type";
import { ArmorItem } from "../../features/gear/armor-item";
import { EquipmentItem } from "../../features/gear/equipment-item";
import { IDatabaseContext } from "../common/data-access/database-context-interface";
import { DbSet } from "../common/data-access/db-set";
import { WeaponItem } from "../../features/gear/weapon-item";
import { Npc } from "../../features/npcs/npc";
import { IDatabase } from "../common/data-access/database-interface";

export class AppDatabaseContext implements IDatabaseContext {
    public static inject = ["database"] as const;

    private _db: IDatabase;
    private _dbSets: Map<string, DbSet<any>>;

    constructor(db: IDatabase) {
        this._db = db;
        this._dbSets = new Map<string, DbSet<any>>();
    }

    public async initializeAsync(connectionString: string): Promise<void> {
        await this._db.loadAsync(connectionString);

        this._dbSets.clear();
        this._dbSets.set(
            ArmorItem.name,
            new DbSet<ArmorItem>(this._db.getCollection("armor").map((obj) => Object.assign(new ArmorItem(), obj)))
        );
        this._dbSets.set(
            EquipmentItem.name,
            new DbSet<EquipmentItem>(
                this._db.getCollection("equipment").map((obj) => Object.assign(new EquipmentItem(), obj))
            )
        );
        this._dbSets.set(
            WeaponItem.name,
            new DbSet<WeaponItem>(this._db.getCollection("weapons").map((obj) => Object.assign(new WeaponItem(), obj)))
        );
        this._dbSets.set(
            Npc.name,
            new DbSet<Npc>(this._db.getCollection("npcs").map((obj) => Object.assign(new Npc(), obj)))
        );
    }

    public getSet<T>(type: Constructor<T>): DbSet<T> {
        const typeName = type.name;
        const dbSet = this._dbSets.get(typeName);

        if (dbSet) {
            return dbSet as DbSet<T>;
        }

        throw new Error(`DbSet of type ${typeName} not found.`);
    }

    public saveChanges() {
        //this.db.save(this._dbSets);
    }
}
