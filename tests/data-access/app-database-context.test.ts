import { ArmorItem } from "../../src/features/gear/armor-item";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { LocalFileStorage } from "./local-file-storage";
import { SingleFileJsonDatabase } from "../../src/lib/data-access/single-file-json-database";
import { AppSettings } from "../../src/lib/settings/app-settings";

describe("AppDatabaseContext", () => {
    const jsonDatabaseFilePath = "./tests/data/json/database.json";

    let appSettings: AppSettings;
    let fileStorage: LocalFileStorage;
    let database: SingleFileJsonDatabase;

    beforeEach(async () => {
        appSettings = new AppSettings();
        fileStorage = new LocalFileStorage();
        database = new SingleFileJsonDatabase(fileStorage);

        appSettings.connectionString = jsonDatabaseFilePath;
    });

    it("temp", () => {
        const dbContext = new AppDatabaseContext(database, appSettings);

        expect(dbContext.getSet(ArmorItem).toArray().length).toBe(5);
        expect(dbContext.getSet(ArmorItem).toArray()[0].name).toBe("Standard Crew Attire");
    });
});
