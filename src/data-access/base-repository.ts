import { Constructor } from "../common/constructor-type";
import { IDatabase } from "./database-interface";
import { IRepository } from "./repositoy-interface";

export abstract class BaseRepository<T> implements IRepository<T> {
    private type: Constructor<T>;
    private db: IDatabase;

    constructor(type: Constructor<T>, db: IDatabase) {
        this.type = type;
        this.db = db;
    }

    public list(): T[] {
        return this.db.getSet<T>(this.type).toArray();
    }
}
