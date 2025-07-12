import { IBlobStorage } from "../common/data-access/blob-storage-interface";

export class BrowserBlobStorage implements IBlobStorage {
    public static inject = ["webStorage"] as const;

    private webStorage: Storage;

    constructor(webStorage: Storage) {
        this.webStorage = webStorage;
    }

    public async getBlobAsync(key: string): Promise<string> {
        return this.webStorage.getItem(key) ?? "";
    }

    public async setBlobAsync(key: string, value: string): Promise<void> {
        this.webStorage.setItem(key, value);
    }
}
