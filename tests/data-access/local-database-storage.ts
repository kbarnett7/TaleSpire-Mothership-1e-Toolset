import * as fs from "fs";
import { IDatabaseStorage } from "../../src/lib/common/data-access/database-storage-interface";

export class LocalDatabaseStorage implements IDatabaseStorage {
    public load(location: string): string {
        try {
            return fs.readFileSync(location, "utf-8");
        } catch (e) {
            console.error("Error reading file:", e);
            return "";
        }
    }

    public save(location: string, fileContents: string): void {
        try {
            fs.writeFileSync(location, fileContents, "utf-8");
        } catch (e) {
            console.error("Error writing file:", e);
            throw e;
        }
    }
}
