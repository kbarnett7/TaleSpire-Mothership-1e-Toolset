import { Constructor } from "../common/types/constructor-type";
import { IDatabase } from "../common/data-access/database-interface";
import { Repository } from "./repository";
import { IRepository } from "../common/data-access/repository-interface";
import { IUnitOfWork } from "../common/data-access/unit-of-work-interface";

export class UnitOfWork implements IUnitOfWork {
    public static inject = ["database"] as const;

    private db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    repo<T>(type: Constructor<T>): IRepository<T> {
        return new Repository<T>(type, this.db);
    }
}
