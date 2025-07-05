import { IDatabaseStorage } from "../common/data-access/database-storage-interface";

export class TaleSpireDatabaseStorage implements IDatabaseStorage {
    public load(filePath: string): string {
        // don't care about the filePath, so just ignore
        //TS: return ts.localStorage.global.getBlob();
        // I could initiate hte seeding of the database here, by checking if the global blob is empty.
        return "{}";
    }

    public save(filePath: string, fileContents: string): void {
        //TS: ts.localStorage.global.setBlob(fileContents);
    }
}
