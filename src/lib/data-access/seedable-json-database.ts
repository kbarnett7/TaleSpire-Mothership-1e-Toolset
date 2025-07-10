import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { IDatabase } from "../common/data-access/database-interface";
import { ErrorCode } from "../errors/error-code";
import { LocalizationService } from "../localization/localization-service";
import { MessageKeys } from "../localization/message-keys";
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

    private getJsonDb(): any {
        return JSON.parse(this.blobStorage.getBlob(this.storageKey));
    }

    public connect(storageKey: string): Result<string> {
        if (storageKey.trim() === "") {
            return this.createCouldNotConnectFailureResult();
        }

        this.storageKey = storageKey;

        this.seedDatabase(storageKey);

        return Result.success(storageKey);
    }

    private createCouldNotConnectFailureResult(): Result<string> {
        return Result.failure(
            new ResultError(
                ErrorCode.DatabaseConnectionError,
                LocalizationService.instance.translate(MessageKeys.couldNotConnectToDatabase),
                [LocalizationService.instance.translate(MessageKeys.storageKeyEmpty)]
            )
        );
    }

    private seedDatabase(storageKey: string): void {
        if (this.blobStorage.getBlob(storageKey).trim() === "") {
            this.blobStorage.setBlob(storageKey, JSON.stringify(this.seedJson));
        }
    }

    public save(collections: Map<string, any[]>): void {
        const dbJson = this.getJsonDb();

        for (const [key, value] of collections) {
            if (key in dbJson) {
                dbJson[key] = value;
            }
        }

        this.blobStorage.setBlob(this.storageKey, JSON.stringify(dbJson));
    }

    public getCollection(collectionName: string): any[] {
        if (!this.isConnectedToDatabase()) {
            throw new Error(LocalizationService.instance.translate(MessageKeys.notConnectedToDatabase));
        }

        if (collectionName.trim() === "") {
            return [];
        }

        const dbJson = this.getJsonDb();

        if (!(collectionName in dbJson)) {
            AppLogger.instance.warn(`Could not find the collection "${collectionName}" in the database.`);
            return [];
        }

        return dbJson[collectionName];
    }
}
