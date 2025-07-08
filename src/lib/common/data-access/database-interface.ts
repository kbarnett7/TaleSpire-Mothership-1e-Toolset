import { Result } from "../../result/result";

export interface IDatabase {
    connect(dataLocation: string): Result<string>;
    save(collections: Map<string, any[]>): void;
    getCollection(collectionName: string): any[];
}
