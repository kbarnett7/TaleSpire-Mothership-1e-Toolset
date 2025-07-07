import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { IDatabase } from "../common/data-access/database-interface";
import { AppLogger } from "../logging/app-logger";
import { Result } from "../result/result";

export class SeedableJsonDatabase implements IDatabase {
    public static inject = ["blobStorage", "seedJson"] as const;

    private blobStorage: IBlobStorage;
    private seedJson: any;
    private storageKey: string;
    //private jsonDb: any;

    constructor(blobStorage: IBlobStorage, seedJson: any) {
        this.blobStorage = blobStorage;
        this.seedJson = seedJson;
        this.storageKey = "";
    }

    public load(storageKey: string): Result<string> {
        this.seedDatabase(storageKey);

        //const fileContents: string = this.blobStorage.getBlob(storageKey);

        this.storageKey = storageKey;
        //this.jsonDb = JSON.parse(fileContents);

        return Result.success(this.storageKey);
    }

    private seedDatabase(storageKey: string) {
        if (this.blobStorage.getBlob(storageKey) === null || this.blobStorage.getBlob(storageKey) === "") {
            this.blobStorage.setBlob(storageKey, JSON.stringify(this.seedJson));
        }
    }

    public save(collections: Map<string, any[]>): void {
        const dbBlob: string = this.blobStorage.getBlob(this.storageKey);
        const dbJson = JSON.parse(dbBlob);

        for (const [key, value] of collections) {
            if (key in dbJson) {
                dbJson[key] = value;
            }
        }

        this.blobStorage.setBlob(this.storageKey, JSON.stringify(dbJson));
    }

    public getCollection(collectionName: string): any[] {
        const dbBlob: string = this.blobStorage.getBlob(this.storageKey);
        const dbJson = JSON.parse(dbBlob);

        if (!(collectionName in dbJson)) {
            AppLogger.instance.warn(`Could not find the collection "${collectionName}" in the database.`);
            return [];
        }

        return dbJson[collectionName];
    }
}
