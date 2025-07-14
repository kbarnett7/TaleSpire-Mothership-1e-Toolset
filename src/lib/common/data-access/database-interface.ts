import { Result } from "../../result/result";

export interface IDatabase {
    connect(storageKey: string): Promise<Result<string>>;
    save(collections: Map<string, any[]>): Promise<void>;
    getCollection(collectionName: string): Promise<any[]>;
}
