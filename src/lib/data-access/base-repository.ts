import { Constructor } from "../common/types/constructor-type";
import { IDatabaseContext } from "../common/data-access/database-context-interface";
import { IRepository } from "../common/data-access/repository-interface";

export abstract class BaseRepository<T> implements IRepository<T> {
    private type: Constructor<T>;
    private dbContext: IDatabaseContext;

    constructor(type: Constructor<T>, dbContext: IDatabaseContext) {
        this.type = type;
        this.dbContext = dbContext;
    }

    public first(predicate?: ((item: T) => boolean) | undefined): T | undefined {
        const items = this.list();

        if (predicate) {
            return items.find(predicate);
        }

        if (items.length > 0) {
            return items[0];
        }

        return undefined;
    }

    public list(): T[] {
        return this.dbContext.getSet<T>(this.type).toArray();
    }
}
