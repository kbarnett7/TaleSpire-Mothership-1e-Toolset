import databaseJson from "../../database/json/database.json";
import { IFileStorage } from "../common/data-access/file-storage-interface";

export class BrowserFileStorage implements IFileStorage {
    public async loadAsync(filePath: string): Promise<string> {
        return JSON.stringify(databaseJson);
    }
    public async saveAsync(filePath: string, fileContents: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
