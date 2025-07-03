import * as fs from "fs";
import { IFileStorage } from "../../src/lib/common/data-access/file-storage-interface";

export class LocalFileStorage implements IFileStorage {
    public async loadAsync(filePath: string): Promise<string> {
        try {
            return await fs.promises.readFile(filePath, "utf-8");
        } catch (e) {
            console.error("Error reading file:", e);
            return "";
        }
    }

    public async saveAsync(filePath: string, fileContents: string): Promise<void> {
        try {
            await fs.promises.writeFile(filePath, fileContents, "utf-8");
        } catch (e) {
            console.error("Error writing file:", e);
            throw e;
        }
    }
}
