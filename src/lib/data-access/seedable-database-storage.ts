import databaseJson from "../../database/json/database.json";
import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { IDatabaseStorage } from "../common/data-access/database-storage-interface";

export class SeedableDatabaseStorage implements IDatabaseStorage {
    public static inject = ["blobStorage"] as const;

    private blobStorage: IBlobStorage;

    constructor(blobStorage: IBlobStorage) {
        this.blobStorage = blobStorage;
    }

    public load(location: string): string {
        if (this.blobStorage.getBlob(location) === null || this.blobStorage.getBlob(location) === "") {
            this.blobStorage.setBlob(location, JSON.stringify(databaseJson));
        }

        return this.blobStorage.getBlob(location);
    }

    public save(location: string, fileContents: string): void {
        this.blobStorage.setBlob(location, fileContents);
    }
}
