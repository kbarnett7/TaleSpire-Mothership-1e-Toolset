import { Constructor } from "../../common/types/constructor-type";
import { IRepository } from "./repositoy-interface";

export interface IUnitOfWork {
    repo<T>(type: Constructor<T>): IRepository<T>;
}
