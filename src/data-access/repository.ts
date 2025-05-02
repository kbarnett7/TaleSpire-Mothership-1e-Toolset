import { Constructor } from "../common/types/constructor-type";
import { BaseRepository } from "./base-repository";
import { IDatabase } from "./contracts/database-interface";

export class Repository<T> extends BaseRepository<T> {
    constructor(type: Constructor<T>, db: IDatabase) {
        super(type, db);
    }
}
