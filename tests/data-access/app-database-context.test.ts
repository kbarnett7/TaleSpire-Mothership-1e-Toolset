import { ArmorItem } from "../../src/features/gear/armor-item";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { LocalFileStorage } from "../../src/lib/data-access/local-file-storage";
import { SingleFileJsonDatabase } from "../../src/lib/data-access/single-file-json-database";

describe("AppDatabaseContext", () => {
    const jsonDatabaseFilePath = "./tests/data/json/database.json";

    let fileStorage: LocalFileStorage;
    let database: SingleFileJsonDatabase;

    beforeEach(async () => {
        fileStorage = new LocalFileStorage();
        database = new SingleFileJsonDatabase(fileStorage);
    });

    it("temp", async () => {
        const dbContext = new AppDatabaseContext(database);

        await dbContext.initializeAsync(jsonDatabaseFilePath);

        expect(dbContext.getSet(ArmorItem).toArray().length).toBe(5);
        expect(dbContext.getSet(ArmorItem).toArray()[0].name).toBe("Standard Crew Attire");
    });
});
