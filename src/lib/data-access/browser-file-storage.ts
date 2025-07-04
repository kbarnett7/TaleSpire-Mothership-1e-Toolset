import databaseJson from "../../database/json/database.json";
import { IFileStorage } from "../common/data-access/file-storage-interface";

export class BrowserFileStorage implements IFileStorage {
    public load(filePath: string): string {
        return JSON.stringify(databaseJson);
    }
    public save(filePath: string, fileContents: string): void {
        throw new Error("Method not implemented.");
    }
}
