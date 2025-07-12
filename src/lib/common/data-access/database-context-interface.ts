import { Constructor } from "../types/constructor-type";
import { DbSet } from "./db-set";

export interface IDatabaseContext {
    initialize(): Promise<void>;
    getSet<T>(type: Constructor<T>): DbSet<T>;
    saveChanges(): Promise<void>;
}
