import { Constructor } from "../common/types/constructor-type";
import { IDatabaseContext } from "../common/data-access/database-context-interface";
import { IRepository } from "../common/data-access/repository-interface";
import { DbSet } from "../common/data-access/db-set";

export abstract class BaseRepository<T> implements IRepository<T> {
    private type: Constructor<T>;
    private dbContext: IDatabaseContext;

    constructor(type: Constructor<T>, dbContext: IDatabaseContext) {
        this.type = type;
        this.dbContext = dbContext;
    }

    private getSet(): DbSet<T> {
        return this.dbContext.getSet<T>(this.type);
    }

    public first(predicate?: ((entity: T) => boolean) | undefined): T | undefined {
        const entities = this.list();

        if (predicate) {
            return entities.find(predicate);
        }

        if (entities.length > 0) {
            return entities[0];
        }

        return undefined;
    }

    public list(): T[] {
        return this.getSet().toArray();
    }

    public add(entity: T): void {
        this.getSet().add(entity);
    }
}
