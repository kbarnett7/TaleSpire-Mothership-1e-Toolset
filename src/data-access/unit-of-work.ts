import { IDatabase } from "./database-interface";
import { Repository } from "./repository";
import { IRepository } from "./repositoy-interface";
import { IUnitOfWork } from "./unit-of-work-interface";

export class UnitOfWork implements IUnitOfWork {
    private db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    repo<T>(type: string): IRepository<T> {
        return new Repository<T>(type, this.db);
    }
}
