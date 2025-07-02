import { Constructor } from "../types/constructor-type";
import { DbSet } from "./db-set";

export interface IDatabaseContext {
    getSet<T>(type: Constructor<T>): DbSet<T>;
}
