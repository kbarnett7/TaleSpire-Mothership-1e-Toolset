import { BaseRepository } from "./base-repository";
import { IDatabase } from "./database-interface";

export class Repository<T> extends BaseRepository<T> {
    constructor(type: string, db: IDatabase) {
        super(type, db);
    }
}
