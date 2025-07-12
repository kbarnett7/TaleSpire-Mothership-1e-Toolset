import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { BrowserBlobStorage } from "./browser-blob-storage";
import { TaleSpireBlobStorage } from "./talespire-blob-storage";

export class BlobStorageAdapter implements IBlobStorage {
    public static inject = ["taleSpireService", "webStorage", "environment"] as const;

    private impl: IBlobStorage;

    constructor(taleSpireService: any, webStorage: Storage, environment: string) {
        if (environment === "production") {
            this.impl = new TaleSpireBlobStorage(taleSpireService);
        } else {
            this.impl = new BrowserBlobStorage(webStorage);
        }
    }

    public getBlob(key: string): string {
        return this.impl.getBlob(key);
    }

    public setBlob(key: string, value: string): void {
        this.impl.setBlob(key, value);
    }
}
