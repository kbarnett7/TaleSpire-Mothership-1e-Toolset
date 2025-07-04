import { LocalFileStorage } from "./local-file-storage";
import { SingleJsonFileDatabase } from "../../src/lib/data-access/single-json-file-database";

describe("SingleFileJsonDatabase", () => {
    const jsonDatabaseFilePath = "./tests/data/json/single-file-json-database.json";

    let fileStorage: LocalFileStorage;

    beforeEach(() => {
        fileStorage = new LocalFileStorage();
    });

    it("should return a successful result when loading a valid JSON file", () => {
        const db = new SingleJsonFileDatabase(fileStorage);

        const result = db.load(jsonDatabaseFilePath);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(jsonDatabaseFilePath);
    });

    it("should return an empty array for a collection that exists and is empty", () => {
        const db = new SingleJsonFileDatabase(fileStorage);
        db.load(jsonDatabaseFilePath);

        const result = db.getCollection("emptyCollection");

        expect(result.length).toBe(0);
    });

    it("should return an non-empty array for a collection that exists and has one or more elements in it", () => {
        const db = new SingleJsonFileDatabase(fileStorage);
        db.load(jsonDatabaseFilePath);

        const result = db.getCollection("populatedCollection");

        expect(result.length).toBeGreaterThanOrEqual(1);
    });
});
