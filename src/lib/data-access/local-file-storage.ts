import * as fs from "fs";

export class LocalFileStorage {
    public async load(filePath: string): Promise<string> {
        try {
            return await fs.promises.readFile(filePath, "utf-8");
        } catch (e) {
            console.error("Error reading file:", e);
            return "";
        }
    }

    public save(filePath: string, fileContents: string) {
        //TS: ts.localStorage.global.setBlob(fileContents);
    }
}
