import { DbSet } from "./db-set";

export interface IDatabase {
    getSet<T>(type: string): DbSet<T>;
}
