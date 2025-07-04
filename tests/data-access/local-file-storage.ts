import * as fs from "fs";
import { IFileStorage } from "../../src/lib/common/data-access/file-storage-interface";

export class LocalFileStorage implements IFileStorage {
    public load(filePath: string): string {
        try {
            return fs.readFileSync(filePath, "utf-8");
        } catch (e) {
            console.error("Error reading file:", e);
            return "";
        }
    }

    public save(filePath: string, fileContents: string): void {
        try {
            fs.writeFileSync(filePath, fileContents, "utf-8");
        } catch (e) {
            console.error("Error writing file:", e);
            throw e;
        }
    }
}
