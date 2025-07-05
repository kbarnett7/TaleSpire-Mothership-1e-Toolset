import seedJson from "../data/json/database.json";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { AppSettings } from "../../src/lib/settings/app-settings";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import { SeedableJsonDatabase } from "../../src/lib/data-access/seedable-json-database";

describe("AppDatabaseContext", () => {
    let appSettings: AppSettings;
    let database: SeedableJsonDatabase;

    beforeEach(async () => {
        appSettings = new AppSettings();
        database = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), seedJson);

        appSettings.connectionString = "app_db_key";
    });

    it("temp", () => {
        const dbContext = new AppDatabaseContext(database, appSettings);

        expect(dbContext.getSet(ArmorItem).toArray().length).toBe(5);
        expect(dbContext.getSet(ArmorItem).toArray()[0].name).toBe("Standard Crew Attire");
    });
});
