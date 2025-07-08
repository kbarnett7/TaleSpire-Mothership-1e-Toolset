import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { IDatabase } from "../common/data-access/database-interface";
import { ErrorCode } from "../errors/error-code";
import { LocalizationService } from "../localization/localization-service";
import { AppLogger } from "../logging/app-logger";
import { Result } from "../result/result";
import { ResultError } from "../result/result-error";

export class SeedableJsonDatabase implements IDatabase {
    public static inject = ["blobStorage", "seedJson"] as const;

    private blobStorage: IBlobStorage;
    private seedJson: any;
    private storageKey: string;

    constructor(blobStorage: IBlobStorage, seedJson: any) {
        this.blobStorage = blobStorage;
        this.seedJson = seedJson;
        this.storageKey = "";
    }

    private isConnectedToDatabase(): boolean {
        return this.storageKey.trim() !== "";
    }

    public connect(storageKey: string): Result<string> {
        if (storageKey.trim() === "") {
            return Result.failure(
                new ResultError(ErrorCode.DatabaseConnectionError, "Could not connect the JSON database.", [
                    "storageKey is empty",
                ])
            );
        }

        this.storageKey = storageKey;

        this.seedDatabase(storageKey);

        return Result.success(storageKey);
    }

    private seedDatabase(storageKey: string) {
        if (this.blobStorage.getBlob(storageKey).trim() === "") {
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
        if (!this.isConnectedToDatabase()) {
            throw new Error(LocalizationService.instance.translate("notConnectedToDatabase"));
        }

        const dbBlob: string = this.blobStorage.getBlob(this.storageKey);
        const dbJson = JSON.parse(dbBlob);

        if (!(collectionName in dbJson)) {
            AppLogger.instance.warn(`Could not find the collection "${collectionName}" in the database.`);
            return [];
        }

        return dbJson[collectionName];
    }
}
