import { IFileStorage } from "../common/data-access/file-storage-interface";

export class TaleSpireFileStorage implements IFileStorage {
    public async loadAsync(filePath: string): Promise<string> {
        // don't care about the filePath, so just ignore
        //TS: return ts.localStorage.global.getBlob();
        return await Promise.resolve("");
    }

    public async saveAsync(filePath: string, fileContents: string): Promise<void> {
        //TS: ts.localStorage.global.setBlob(fileContents);
    }
}
