import testAppDbSeedJson from "../data/json/database.json";
import testJson from "../data/json/single-file-json-database.json";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import { SeedableJsonDatabase } from "../../src/lib/data-access/seedable-json-database";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";

describe("SeedableJsonDatabase", () => {
    const appDbLocation = "app_db_key";

    beforeEach(() => {
        window.localStorage.clear();
    });

    it("should return a failure result when storage key string is empty", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);

        const result = db.connect("");

        expect(result.isFailure).toBe(true);
        expect(result.error.code).toBe(ErrorCode.DatabaseConnectionError);
    });

    it("should return a successful result when connecting to a valid JSON file", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);

        const result = db.connect(appDbLocation);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(appDbLocation);
    });

    it("should seed the database with default database when the database is empty", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testAppDbSeedJson);

        db.connect(appDbLocation);

        expect(db.getCollection("sources").length).toBe(3);
    });

    it("should not seed the database with default database when the database is not empty", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testAppDbSeedJson);
        const newSource = {
            id: 4,
            name: "Fake",
        };
        db.connect(appDbLocation);
        let sources = db.getCollection("sources");
        sources.push(newSource);
        const changes = new Map<string, any[]>();
        changes.set("sources", sources);
        db.save(changes);

        db.connect(appDbLocation);

        expect(db.getCollection("sources").length).toBe(4);
    });

    it("should throw an exception when attempting to get a collection before connecting to the database", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        const expectedMessage = LocalizationService.instance.translate("notConnectedToDatabase");

        expect(() => {
            db.getCollection("populatedCollection");
        }).toThrow(expectedMessage);
    });

    it("should return an empty array for a collection that exists and is empty", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        db.connect(appDbLocation);

        const result = db.getCollection("emptyCollection");

        expect(result.length).toBe(0);
    });

    it("should return an non-empty array for a collection that exists and has one or more elements in it", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        db.connect(appDbLocation);

        const result = db.getCollection("populatedCollection");

        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("should return an empty array for a collection that does not exists", () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        db.connect(appDbLocation);

        const result = db.getCollection("nonExistantCollection");

        expect(result.length).toBe(0);
    });
});
