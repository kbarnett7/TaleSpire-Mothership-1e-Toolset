import { Constructor } from "../common/types/constructor-type";
import { BaseRepository } from "./base-repository";
import { IDatabaseContext } from "../common/data-access/database-context-interface";

export class Repository<T> extends BaseRepository<T> {
    constructor(type: Constructor<T>, dbContext: IDatabaseContext) {
        super(type, dbContext);
    }
}
