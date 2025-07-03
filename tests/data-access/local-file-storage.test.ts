import { LocalFileStorage } from "../../src/lib/data-access/local-file-storage";

describe("LocalFileStorage", () => {
    const jsonDatabaseFilePath = "./tests/data/json/single-file-json-database.json";

    beforeEach(() => {});

    it("temp", async () => {
        const fileStorage = new LocalFileStorage();

        const fileContents = await fileStorage.loadAsync(jsonDatabaseFilePath);

        expect(fileContents.length).toBeGreaterThan(0);
    });

    it("load JSON file", async () => {
        const fileStorage = new LocalFileStorage();

        const fileContents = await fileStorage.loadAsync(jsonDatabaseFilePath);
        const json = JSON.parse(fileContents);

        expect(json.version).toBe(1.0);
        expect(json["version"]).toBe(1.0);
        expect(json.populatedCollection.length).toBeGreaterThan(1);
    });

    //Load into a JsonFileDatabase object, which is then used by the DBContext class?
});
