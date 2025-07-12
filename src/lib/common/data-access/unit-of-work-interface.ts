import { Constructor } from "../types/constructor-type";
import { IRepository } from "./repository-interface";

export interface IUnitOfWork {
    initialize(): Promise<void>;
    repo<T>(type: Constructor<T>): IRepository<T>;
    saveChanges(): Promise<void>;
}
