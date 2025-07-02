import { LocalFileStorage } from "../../src/lib/data-access/local-file-storage";

describe("LocalFileStorage", () => {
    const jsonDatabaseFilePath = "./tests/data/json/database.json";

    beforeEach(() => {});

    it("temp", async () => {
        const fileStorage = new LocalFileStorage();

        const fileContents = await fileStorage.load(jsonDatabaseFilePath);

        expect(fileContents.length).toBeGreaterThan(0);
    });

    it("load JSON file", async () => {
        const fileStorage = new LocalFileStorage();

        const fileContents = await fileStorage.load(jsonDatabaseFilePath);
        const json = JSON.parse(fileContents);

        expect(json.version).toBe(1.0);
        expect(json.sources.length).toBeGreaterThan(1);
    });
});
