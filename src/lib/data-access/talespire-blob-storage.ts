import { IBlobStorage } from "../common/data-access/blob-storage-interface";

declare const TS: any;

export class TaleSpireBlobStorage implements IBlobStorage {
    public async getBlobAsync(key: string): Promise<string> {
        if (!TS) {
            return "";
        }

        let blob = "";

        TS.localStorage.global.getBlob().then((globalBlob: string) => {
            blob = globalBlob;
        });

        if (!blob || blob === "") {
            return "";
        }

        return blob;
    }

    public async setBlobAsync(key: string, value: string): Promise<void> {
        if (!TS) {
            return;
        }

        TS.localStorage.global.setBlob(value).then(() => {
            console.log("Database set!");
        });
    }
}
