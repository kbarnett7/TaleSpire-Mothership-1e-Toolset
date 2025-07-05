import { ArmorItem } from "../../src/features/gear/armor-item";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { SingleJsonFileDatabase } from "../../src/lib/data-access/single-json-file-database";
import { AppSettings } from "../../src/lib/settings/app-settings";
import { SeedableDatabaseStorage } from "../../src/lib/data-access/seedable-database-storage";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import seedJson from "../data/json/database.json";

describe("AppDatabaseContext", () => {
    let appSettings: AppSettings;
    let databaseStorage: SeedableDatabaseStorage;
    let database: SingleJsonFileDatabase;

    beforeEach(async () => {
        appSettings = new AppSettings();
        databaseStorage = new SeedableDatabaseStorage(new BrowserBlobStorage(window.localStorage), seedJson);
        database = new SingleJsonFileDatabase(databaseStorage);

        appSettings.connectionString = "app_db_key";
    });

    it("temp", () => {
        const dbContext = new AppDatabaseContext(database, appSettings);

        expect(dbContext.getSet(ArmorItem).toArray().length).toBe(5);
        expect(dbContext.getSet(ArmorItem).toArray()[0].name).toBe("Standard Crew Attire");
    });
});
