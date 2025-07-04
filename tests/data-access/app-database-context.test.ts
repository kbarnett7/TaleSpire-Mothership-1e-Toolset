import { ArmorItem } from "../../src/features/gear/armor-item";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { LocalFileStorage } from "./local-file-storage";
import { SingleJsonFileDatabase } from "../../src/lib/data-access/single-json-file-database";
import { AppSettings } from "../../src/lib/settings/app-settings";

describe("AppDatabaseContext", () => {
    const jsonDatabaseFilePath = "./tests/data/json/database.json";

    let appSettings: AppSettings;
    let fileStorage: LocalFileStorage;
    let database: SingleJsonFileDatabase;

    beforeEach(async () => {
        appSettings = new AppSettings();
        fileStorage = new LocalFileStorage();
        database = new SingleJsonFileDatabase(fileStorage);

        appSettings.connectionString = jsonDatabaseFilePath;
    });

    it("temp", () => {
        const dbContext = new AppDatabaseContext(database, appSettings);

        expect(dbContext.getSet(ArmorItem).toArray().length).toBe(5);
        expect(dbContext.getSet(ArmorItem).toArray()[0].name).toBe("Standard Crew Attire");
    });
});
