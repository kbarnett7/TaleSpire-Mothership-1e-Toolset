import { Constructor } from "../common/constructor-type";
import { DbSet } from "./db-set";

export interface IDatabase {
    getSet<T>(type: Constructor<T>): DbSet<T>;
}
