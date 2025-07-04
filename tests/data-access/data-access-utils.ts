import { IDatabaseContext } from "../../src/lib/common/data-access/database-context-interface";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { LocalFileStorage } from "./local-file-storage";
import { SingleJsonFileDatabase } from "../../src/lib/data-access/single-json-file-database";
import { AppSettings } from "../../src/lib/settings/app-settings";

export class DataAccessUtils {
    static getInitializedDbContext(jsonDatabaseFilePath: string): IDatabaseContext {
        const appSettings = new AppSettings();
        appSettings.connectionString = jsonDatabaseFilePath;

        const fileStorage = new LocalFileStorage();
        const db = new SingleJsonFileDatabase(fileStorage);
        const dbContext = new AppDatabaseContext(db, appSettings);

        return dbContext;
    }
}
