import { LocalFileStorage } from "../data-access/local-file-storage";

describe("LocalFileStorage", () => {
    const jsonDatabaseFilePath = "./tests/data/json/single-file-json-database.json";

    beforeEach(() => {});

    it("temp", () => {
        const fileStorage = new LocalFileStorage();

        const fileContents = fileStorage.load(jsonDatabaseFilePath);

        expect(fileContents.length).toBeGreaterThan(0);
    });

    it("load JSON file", () => {
        const fileStorage = new LocalFileStorage();

        const fileContents = fileStorage.load(jsonDatabaseFilePath);
        const json = JSON.parse(fileContents);

        expect(json.version).toBe(1.0);
        expect(json["version"]).toBe(1.0);
        expect(json.populatedCollection.length).toBeGreaterThan(1);
    });

    //Load into a JsonFileDatabase object, which is then used by the DBContext class?
});
