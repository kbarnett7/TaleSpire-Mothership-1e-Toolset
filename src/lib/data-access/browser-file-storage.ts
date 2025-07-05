import databaseJson from "../../database/json/database.json";
import { IFileStorage } from "../common/data-access/file-storage-interface";

export class BrowserFileStorage implements IFileStorage {
    public static inject = ["webStorage"] as const;

    private webStorage: Storage;

    constructor(webStorage: Storage) {
        this.webStorage = webStorage;
    }

    public load(filePath: string): string {
        if (this.webStorage.getItem(filePath) === null || this.webStorage.getItem(filePath) === "") {
            this.webStorage.setItem(filePath, JSON.stringify(databaseJson));
        }

        return this.webStorage.getItem(filePath) ?? "{}";
    }

    public save(filePath: string, fileContents: string): void {
        this.webStorage.setItem(filePath, fileContents);
    }
}
