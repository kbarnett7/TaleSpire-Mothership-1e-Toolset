import { IDatabase } from "./database-interface";
import { IRepository } from "./repositoy-interface";

export abstract class BaseRepository<T> implements IRepository<T> {
    private type: string;
    private db: IDatabase;

    constructor(type: string, db: IDatabase) {
        this.type = type;
        this.db = db;
    }

    public list(): T[] {
        return this.db.getSet<T>(this.type).toArray();
    }
}
