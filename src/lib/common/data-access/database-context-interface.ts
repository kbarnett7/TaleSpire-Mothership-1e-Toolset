import { Constructor } from "../types/constructor-type";
import { DbSet } from "./db-set";

export interface IDatabaseContext {
    initialize(connectionString: string): void;
    getSet<T>(type: Constructor<T>): DbSet<T>;
    saveChanges(): void;
}
