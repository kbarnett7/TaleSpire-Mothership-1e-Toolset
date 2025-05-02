import { Constructor } from "../common/types/constructor-type";
import { IDatabase } from "../common/data-access/database-interface";
import { IRepository } from "../common/data-access/repositoy-interface";

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
