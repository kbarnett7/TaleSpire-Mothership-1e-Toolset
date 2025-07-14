import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { ITaleSpireApi } from "../talespire/talespire-api-interface";

declare const TS: ITaleSpireApi;

export class TaleSpireBlobStorage implements IBlobStorage {
    public async getBlobAsync(key: string): Promise<string> {
        if (!TS) {
            return "";
        }

        const blob = await TS.localStorage.global.getBlob();

        if (!blob) {
            return "";
        }

        return blob;
    }

    public async setBlobAsync(key: string, value: string): Promise<void> {
        if (!TS) {
            return;
        }

        await TS.localStorage.global.setBlob(value);
    }
}
