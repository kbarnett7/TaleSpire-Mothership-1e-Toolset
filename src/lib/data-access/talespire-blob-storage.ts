import { IBlobStorage } from "../common/data-access/blob-storage-interface";

export class TaleSpireBlobStorage implements IBlobStorage {
    public getBlob(key: string): string {
        //TS: return ts.localStorage.global.getBlob();
        throw new Error("Method not implemented.");
    }

    public setBlob(key: string, value: string): void {
        //TS: ts.localStorage.global.setBlob(fileContents);
        throw new Error("Method not implemented.");
    }
}
