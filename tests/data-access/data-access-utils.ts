import { IDatabaseContext } from "../../src/lib/common/data-access/database-context-interface";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { SingleJsonFileDatabase } from "../../src/lib/data-access/single-json-file-database";
import { AppSettings } from "../../src/lib/settings/app-settings";
import seedJson from "../data/json/database.json";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import { SeedableDatabaseStorage } from "../../src/lib/data-access/seedable-database-storage";

export class DataAccessUtils {
    static getInitializedDbContext(): IDatabaseContext {
        const appSettings = new AppSettings();
        appSettings.connectionString = "app_db_key";

        const databaseStorage = new SeedableDatabaseStorage(new BrowserBlobStorage(window.localStorage), seedJson);
        const db = new SingleJsonFileDatabase(databaseStorage);
        const dbContext = new AppDatabaseContext(db, appSettings);

        return dbContext;
    }
}
