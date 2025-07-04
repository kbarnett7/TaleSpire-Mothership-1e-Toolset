import { Result } from "../../result/result";

export interface IDatabase {
    load(connectionString: string): Result<string>;
    getCollection(collectionName: string): any[];
}
