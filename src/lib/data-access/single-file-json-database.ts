import { IDatabase } from "../common/data-access/database-interface";
import { IFileStorage } from "../common/data-access/file-storage-interface";
import { Result } from "../result/result";

export class SingleFileJsonDatabase implements IDatabase {
    public static inject = ["fileStorage"] as const;

    private fileStorage: IFileStorage;
    private jsonFilePath: string;
    private jsonDb: any;

    constructor(fileStorage: IFileStorage) {
        this.fileStorage = fileStorage;
        this.jsonFilePath = "";
    }

    public async loadAsync(jsonFilePath: string): Promise<Result<string>> {
        const fileContents: string = await this.fileStorage.loadAsync(jsonFilePath);

        this.jsonFilePath = jsonFilePath;
        this.jsonDb = JSON.parse(fileContents);

        return Result.success(this.jsonFilePath);
    }

    public getCollection(collectionName: string): any[] {
        return this.jsonDb[collectionName];
    }
}
