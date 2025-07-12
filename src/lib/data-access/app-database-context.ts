import { Constructor } from "../common/types/constructor-type";
import { ArmorItem } from "../../features/gear/armor-item";
import { EquipmentItem } from "../../features/gear/equipment-item";
import { IDatabaseContext } from "../common/data-access/database-context-interface";
import { DbSet } from "../common/data-access/db-set";
import { WeaponItem } from "../../features/gear/weapon-item";
import { Npc } from "../../features/npcs/npc";
import { IDatabase } from "../common/data-access/database-interface";
import { AppSettings } from "../settings/app-settings";
import { DatabaseVersion } from "../../features/database-versions/database-version";
import { DatabaseCollectionNames } from "./database-collection-names";
import { AppLogger } from "../logging/app-logger";

export class AppDatabaseContext implements IDatabaseContext {
    public static inject = ["database", "appSettings"] as const;

    private readonly _appSettings: AppSettings;
    private readonly _db: IDatabase;
    private readonly _entityKeyToDbKeyMap: Map<string, string>;
    private readonly _dbSets: Map<string, DbSet<any>>;

    constructor(db: IDatabase, appSettings: AppSettings) {
        this._appSettings = appSettings;
        this._db = db;
        this._entityKeyToDbKeyMap = new Map<string, string>();
        this._dbSets = new Map<string, DbSet<any>>();

        this.initialize(this._appSettings.connectionString);
    }

    public initialize(connectionString: string): void {
        this._db.connect(connectionString);
        this.initializeEntityKeyToDbKeyMap();
        this.initializeDbSets();
    }

    private initializeEntityKeyToDbKeyMap(): void {
        this._entityKeyToDbKeyMap.clear();
        this._entityKeyToDbKeyMap.set(DatabaseVersion.name, DatabaseCollectionNames.databaseVersions);
        this._entityKeyToDbKeyMap.set(ArmorItem.name, DatabaseCollectionNames.armor);
        this._entityKeyToDbKeyMap.set(EquipmentItem.name, DatabaseCollectionNames.equipment);
        this._entityKeyToDbKeyMap.set(WeaponItem.name, DatabaseCollectionNames.weapons);
        this._entityKeyToDbKeyMap.set(Npc.name, DatabaseCollectionNames.npcs);
    }

    private initializeDbSets(): void {
        this._dbSets.clear();

        this._dbSets.set(
            DatabaseVersion.name,
            new DbSet<DatabaseVersion>(
                this._db
                    .getCollection(DatabaseCollectionNames.databaseVersions)
                    .map((obj) => Object.assign(new DatabaseVersion(), obj))
            )
        );

        this._dbSets.set(
            ArmorItem.name,
            new DbSet<ArmorItem>(
                this._db.getCollection(DatabaseCollectionNames.armor).map((obj) => Object.assign(new ArmorItem(), obj))
            )
        );

        this._dbSets.set(
            EquipmentItem.name,
            new DbSet<EquipmentItem>(
                this._db
                    .getCollection(DatabaseCollectionNames.equipment)
                    .map((obj) => Object.assign(new EquipmentItem(), obj))
            )
        );

        this._dbSets.set(
            WeaponItem.name,
            new DbSet<WeaponItem>(
                this._db
                    .getCollection(DatabaseCollectionNames.weapons)
                    .map((obj) => Object.assign(new WeaponItem(), obj))
            )
        );

        this._dbSets.set(
            Npc.name,
            new DbSet<Npc>(
                this._db.getCollection(DatabaseCollectionNames.npcs).map((obj) => Object.assign(new Npc(), obj))
            )
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

    public saveChanges(): void {
        const collections = new Map<string, any[]>();

        for (const [key, dbSet] of this._dbSets) {
            const dbKey = this._entityKeyToDbKeyMap.get(key) ?? "ERROR";
            collections.set(dbKey, dbSet.toArray());
        }

        this._db.save(collections);
    }
}
