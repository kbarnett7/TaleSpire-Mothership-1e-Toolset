import databaseJson from "../../database/json/database.json";
import { IDatabaseStorage } from "../common/data-access/database-storage-interface";

export class BrowserDatabaseStorage implements IDatabaseStorage {
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
