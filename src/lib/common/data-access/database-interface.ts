import { Result } from "../../result/result";

export interface IDatabase {
    load(dataLocation: string): Result<string>;
    save(): void;
    getCollection(collectionName: string): any[];
}
