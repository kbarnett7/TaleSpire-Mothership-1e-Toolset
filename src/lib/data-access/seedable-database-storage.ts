import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { IDatabaseStorage } from "../common/data-access/database-storage-interface";

export class SeedableDatabaseStorage implements IDatabaseStorage {
    public static inject = ["blobStorage", "seedJson"] as const;

    private blobStorage: IBlobStorage;
    private seedJson: any;

    constructor(blobStorage: IBlobStorage, seedJson: any) {
        this.blobStorage = blobStorage;
        this.seedJson = seedJson;
    }

    public load(location: string): string {
        if (this.blobStorage.getBlob(location) === null || this.blobStorage.getBlob(location) === "") {
            this.blobStorage.setBlob(location, JSON.stringify(this.seedJson));
        }

        return this.blobStorage.getBlob(location);
    }

    public save(location: string, fileContents: string): void {
        this.blobStorage.setBlob(location, fileContents);
    }
}
