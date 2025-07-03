import { Result } from "../../result/result";

export interface IDatabase {
    loadAsync(connectionString: string): Promise<Result<string>>;
    getCollection(collectionName: string): any[];
}
