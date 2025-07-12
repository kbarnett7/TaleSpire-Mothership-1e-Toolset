import testAppDbSeedJson from "../data/json/database.json";
import testJson from "../data/json/single-file-json-database.json";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";
import { SeedableJsonDatabase } from "../../src/lib/data-access/seedable-json-database";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { DataAccessUtils } from "./data-access-utils";

describe("SeedableJsonDatabase", () => {
    const appDbLocation = "app_db_key";

    beforeEach(() => {
        DataAccessUtils.clearLocalStorage();
    });

    it("should return a failure result when storage key string is empty", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);

        const result = await db.connect("");

        expect(result.isFailure).toBe(true);
        expect(result.error.code).toBe(ErrorCode.DatabaseConnectionError);
    });

    it("should return a successful result when using a valid storage key", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);

        const result = await db.connect(appDbLocation);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(appDbLocation);
    });

    it("should seed the database with default database when the database is empty", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testAppDbSeedJson);

        await db.connect(appDbLocation);

        const sources = await db.getCollection("sources");
        expect(sources.length).toBe(3);
    });

    it("should not seed the database with default database when the database is not empty", async () => {
        // Arrange
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testAppDbSeedJson);

        // Add a fourth source to the database
        const newSource = {
            id: 4,
            name: "Fake",
        };
        await db.connect(appDbLocation);
        let sources = await db.getCollection("sources");
        sources.push(newSource);
        const changes = new Map<string, any[]>();
        changes.set("sources", sources);
        await db.save(changes);

        // Act
        db.connect(appDbLocation);

        // Assert
        sources = await db.getCollection("sources");
        expect(sources.length).toBe(4);
    });

    it("should throw an exception when attempting to get a collection before connecting to the database", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        const expectedMessage = LocalizationService.instance.translate("notConnectedToDatabase");

        await expect(db.getCollection("populatedCollection")).rejects.toThrow(expectedMessage);
    });

    it("should return an empty array for an empty collection name", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        await db.connect(appDbLocation);

        const result = await db.getCollection("");

        expect(result.length).toBe(0);
    });

    it("should return an empty array for a collection that exists and is empty", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        await db.connect(appDbLocation);

        const result = await db.getCollection("emptyCollection");

        expect(result.length).toBe(0);
    });

    it("should return an non-empty array for a collection that exists and has one or more elements in it", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        await db.connect(appDbLocation);

        const result = await db.getCollection("populatedCollection");

        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("should return an empty array for a collection that does not exists", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        await db.connect(appDbLocation);

        const result = await db.getCollection("nonExistantCollection");

        expect(result.length).toBe(0);
    });

    it("should not add a new collection to the JSON database when saving a collection not already in the JSON database", async () => {
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        const collectionName = "nonExistantCollection";
        const collections = new Map<string, any[]>();
        await db.connect(appDbLocation);
        collections.set(collectionName, [{ id: 1, value: 10 }]);

        await db.save(collections);

        const collection = await db.getCollection(collectionName);
        expect(collection.length).toBe(0);
    });

    it("should save a modified collection to the JSON database", async () => {
        // Arrange
        const db = new SeedableJsonDatabase(new BrowserBlobStorage(window.localStorage), testJson);
        const collectionName = "populatedCollection";
        const collections = new Map<string, any[]>();
        await db.connect(appDbLocation);
        let collection = await db.getCollection(collectionName);

        // Edit an existing item
        collection[0].name = "Edited Name";

        // Add a new item
        collection.push({
            id: 99,
            name: "Test Value Z",
        });

        collections.set(collectionName, collection);

        // Act
        await db.save(collections);

        // Assert
        collection = await db.getCollection(collectionName);
        expect(collection.length).toBe(4);
        expect(collection[0].name).toBe("Edited Name");
        expect(collection[3].id).toBe(99);
        expect(collection[3].name).toBe("Test Value Z");
    });
});
