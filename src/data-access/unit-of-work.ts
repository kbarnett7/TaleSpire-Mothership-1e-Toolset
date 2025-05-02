import { Constructor } from "../common/types/constructor-type";
import { IDatabase } from "./contracts/database-interface";
import { Repository } from "./repository";
import { IRepository } from "./contracts/repositoy-interface";
import { IUnitOfWork } from "./contracts/unit-of-work-interface";

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
