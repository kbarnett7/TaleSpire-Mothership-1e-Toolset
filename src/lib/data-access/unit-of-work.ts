import { Constructor } from "../common/types/constructor-type";
import { IDatabaseContext } from "../common/data-access/database-context-interface";
import { Repository } from "./repository";
import { IRepository } from "../common/data-access/repository-interface";
import { IUnitOfWork } from "../common/data-access/unit-of-work-interface";

export class UnitOfWork implements IUnitOfWork {
    public static inject = ["appDatabaseContext"] as const;

    private dbContext: IDatabaseContext;

    constructor(dbContext: IDatabaseContext) {
        this.dbContext = dbContext;
    }

    repo<T>(type: Constructor<T>): IRepository<T> {
        return new Repository<T>(type, this.dbContext);
    }
}
