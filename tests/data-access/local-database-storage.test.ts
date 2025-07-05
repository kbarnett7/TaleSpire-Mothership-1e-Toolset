import { LocalDatabaseStorage } from "./local-database-storage";

describe("LocalDatabaseStorage", () => {
    const jsonDatabaseFilePath = "./tests/data/json/single-file-json-database.json";

    beforeEach(() => {});

    it("temp", () => {
        const databaseStorage = new LocalDatabaseStorage();

        const fileContents = databaseStorage.load(jsonDatabaseFilePath);

        expect(fileContents.length).toBeGreaterThan(0);
    });

    it("load JSON file", () => {
        const databaseStorage = new LocalDatabaseStorage();

        const fileContents = databaseStorage.load(jsonDatabaseFilePath);
        const json = JSON.parse(fileContents);

        expect(json.version).toBe(1.0);
        expect(json["version"]).toBe(1.0);
        expect(json.populatedCollection.length).toBeGreaterThan(1);
    });

    //Load into a JsonFileDatabase object, which is then used by the DBContext class?
});
