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

    private async getJsonDb(): Promise<any> {
        return JSON.parse(await this.blobStorage.getBlobAsync(this.storageKey));
    }

    public async connect(storageKey: string): Promise<Result<string>> {
        if (storageKey.trim() === "") {
            return this.createCouldNotConnectFailureResult();
        }

        this.storageKey = storageKey;

        await this.seedDatabase(storageKey);

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

    private async seedDatabase(storageKey: string): Promise<void> {
        const blob = await this.blobStorage.getBlobAsync(storageKey);

        if (blob.trim() === "") {
            await this.blobStorage.setBlobAsync(storageKey, JSON.stringify(this.seedJson));
        }
    }

    public async save(collections: Map<string, any[]>): Promise<void> {
        const dbJson = await this.getJsonDb();

        for (const [key, value] of collections) {
            if (key in dbJson) {
                dbJson[key] = value;
            }
        }

        await this.blobStorage.setBlobAsync(this.storageKey, JSON.stringify(dbJson));
    }

    public async getCollection(collectionName: string): Promise<any[]> {
        if (!this.isConnectedToDatabase()) {
            throw new Error(LocalizationService.instance.translate(MessageKeys.notConnectedToDatabase));
        }

        if (collectionName.trim() === "") {
            return [];
        }

        const dbJson = await this.getJsonDb();

        if (!(collectionName in dbJson)) {
            AppLogger.instance.warn(`Could not find the collection "${collectionName}" in the database.`);
            return [];
        }

        return dbJson[collectionName];
    }
}
