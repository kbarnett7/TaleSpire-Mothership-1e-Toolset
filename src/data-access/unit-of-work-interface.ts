import { IRepository } from "./repositoy-interface";

export interface IUnitOfWork {
    repo<T>(type: string): IRepository<T>;
}
