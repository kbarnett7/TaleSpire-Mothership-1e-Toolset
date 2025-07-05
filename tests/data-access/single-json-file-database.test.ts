import { SingleJsonFileDatabase } from "../../src/lib/data-access/single-json-file-database";
import { SeedableDatabaseStorage } from "../../src/lib/data-access/seedable-database-storage";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import seedJson from "../data/json/single-file-json-database.json";

describe("SingleJsonFileDatabase", () => {
    const appDbLocation = "app_db_key";
    const databaseStorage = new SeedableDatabaseStorage(new BrowserBlobStorage(window.localStorage), seedJson);

    it("should return a successful result when loading a valid JSON file", () => {
        const db = new SingleJsonFileDatabase(databaseStorage);

        const result = db.load(appDbLocation);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(appDbLocation);
    });

    it("should return an empty array for a collection that exists and is empty", () => {
        const db = new SingleJsonFileDatabase(databaseStorage);
        db.load(appDbLocation);

        const result = db.getCollection("emptyCollection");

        expect(result.length).toBe(0);
    });

    it("should return an non-empty array for a collection that exists and has one or more elements in it", () => {
        const db = new SingleJsonFileDatabase(databaseStorage);
        db.load(appDbLocation);

        const result = db.getCollection("populatedCollection");

        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("should return an empty array for a collection that does not exists", () => {
        const db = new SingleJsonFileDatabase(databaseStorage);
        db.load(appDbLocation);

        const result = db.getCollection("nonExistantCollection");

        expect(result.length).toBe(0);
    });
});
