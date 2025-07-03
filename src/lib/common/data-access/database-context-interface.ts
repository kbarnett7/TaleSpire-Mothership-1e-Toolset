import { Constructor } from "../types/constructor-type";
import { DbSet } from "./db-set";

export interface IDatabaseContext {
    initializeAsync(connectionString: string): Promise<void>;
    getSet<T>(type: Constructor<T>): DbSet<T>;
}
