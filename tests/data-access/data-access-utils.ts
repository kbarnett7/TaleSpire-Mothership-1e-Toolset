import seedJson from "../data/json/database.json";
import { IDatabaseContext } from "../../src/lib/common/data-access/database-context-interface";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { AppSettings } from "../../src/lib/settings/app-settings";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import { SeedableJsonDatabase } from "../../src/lib/data-access/seedable-json-database";

export class DataAccessUtils {
    static clearLocalStorage(): void {
        window.localStorage.clear();
    }

    static getInitializedDbContext(): IDatabaseContext {
        const appSettings = new AppSettings();
        appSettings.connectionString = "app_db_key";

        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), seedJson);
        const dbContext = new AppDatabaseContext(db, appSettings);

        return dbContext;
    }
}
