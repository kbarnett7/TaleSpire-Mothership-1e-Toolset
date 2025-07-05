import { IBlobStorage } from "../common/data-access/blob-storage-interface";

export class BrowserBlobStorage implements IBlobStorage {
    public static inject = ["webStorage"] as const;

    private webStorage: Storage;

    constructor(webStorage: Storage) {
        this.webStorage = webStorage;
    }

    public getBlob(key: string): string {
        return this.webStorage.getItem(key) ?? "";
    }

    public setBlob(key: string, value: string): void {
        this.webStorage.setItem(key, value);
    }
}
