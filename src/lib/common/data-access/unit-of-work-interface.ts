import { Constructor } from "../types/constructor-type";
import { IRepository } from "./repository-interface";

export interface IUnitOfWork {
    repo<T>(type: Constructor<T>): IRepository<T>;
}
