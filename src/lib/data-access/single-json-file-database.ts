import { IDatabase } from "../common/data-access/database-interface";
import { IDatabaseStorage } from "../common/data-access/database-storage-interface";
import { AppLogger } from "../logging/app-logger";
import { Result } from "../result/result";

export class SingleJsonFileDatabase implements IDatabase {
    public static inject = ["databaseStorage"] as const;

    private databaseStorage: IDatabaseStorage;
    private jsonFilePath: string;
    private jsonDb: any;

    constructor(databaseStorage: IDatabaseStorage) {
        this.databaseStorage = databaseStorage;
        this.jsonFilePath = "";
    }

    public load(jsonFilePath: string): Result<string> {
        const fileContents: string = this.databaseStorage.load(jsonFilePath);

        this.jsonFilePath = jsonFilePath;
        this.jsonDb = JSON.parse(fileContents);

        return Result.success(this.jsonFilePath);
    }

    public getCollection(collectionName: string): any[] {
        if (!(collectionName in this.jsonDb)) {
            AppLogger.instance.warn(`Could not find the collection "${collectionName}" in the database.`);
            return [];
        }

        return this.jsonDb[collectionName];
    }
}
