import { IBlobStorage } from "../common/data-access/blob-storage-interface";

export class TaleSpireBlobStorage implements IBlobStorage {
    public async getBlobAsync(key: string): Promise<string> {
        //TS: return ts.localStorage.global.getBlob();
        //getBlob() returns a promise. This was not documented.
        throw new Error("Method not implemented.");
    }

    public async setBlobAsync(key: string, value: string): Promise<void> {
        //TS: ts.localStorage.global.setBlob(fileContents);
        //setBlob() returns a promise. This was not documented.
        throw new Error("Method not implemented.");
    }
}
