import testAppDbSeedJson from "../data/json/database.json";
import testJson from "../data/json/single-file-json-database.json";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import { SeedableJsonDatabase } from "../../src/lib/data-access/seedable-json-database";

describe("SeedableJsonDatabase", () => {
    const appDbLocation = "app_db_key";

    beforeEach(() => {
        window.localStorage.clear();
    });

    it("should return a successful result when loading a valid JSON file", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);

        const result = db.load(appDbLocation);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(appDbLocation);
    });

    it("when local storage is empty, seed local storage with default database", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testAppDbSeedJson);

        db.load(appDbLocation);

        expect(db.getCollection("sources").length).toBe(3);
    });

    it("when local storage is not empty, do not seed local storage with default database but use existing local storage", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testAppDbSeedJson);
        const newSource = {
            id: 4,
            name: "Fake",
        };
        db.load(appDbLocation);
        let sources = db.getCollection("sources");
        sources.push(newSource);
        db.save();
        sources = db.getCollection("sources");

        expect(sources.length).toBe(4);
    });

    it("should return an empty array for a collection that exists and is empty", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        db.load(appDbLocation);

        const result = db.getCollection("emptyCollection");

        expect(result.length).toBe(0);
    });

    it("should return an non-empty array for a collection that exists and has one or more elements in it", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        db.load(appDbLocation);

        const result = db.getCollection("populatedCollection");

        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("should return an empty array for a collection that does not exists", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        db.load(appDbLocation);

        const result = db.getCollection("nonExistantCollection");

        expect(result.length).toBe(0);
    });
});
