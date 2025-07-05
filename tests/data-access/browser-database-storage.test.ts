import { SeedableDatabaseStorage } from "../../src/lib/data-access/seedable-database-storage";
import { BrowserBlobStorage } from "../../src/lib/data-access/browser-blob-storage";

describe("BrowserDatabaseStorage", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("when local storage is empty, seed local storage with default database", () => {
        const location = "app_db_key";
        const storage = new SeedableDatabaseStorage(new BrowserBlobStorage(window.localStorage));

        const loadedJson = storage.load(location);
        const localStorageJson = localStorage.getItem(location);

        expect(localStorageJson).toBe(loadedJson);
    });

    it("when local storage is not empty, do not seed local storage with default database but use existing local storage", () => {
        const location = "app_db_key";
        const storage = new SeedableDatabaseStorage(new BrowserBlobStorage(window.localStorage));
        const initialJsonStr = storage.load(location);
        const newSource = {
            id: 4,
            name: "Fake",
        };
        const jsonDb = JSON.parse(initialJsonStr);
        jsonDb["sources"].push(newSource);
        storage.save(location, JSON.stringify(jsonDb));

        const currentJsonStr = storage.load(location);
        const currentJson = JSON.parse(currentJsonStr);

        expect(currentJsonStr).not.toBe(initialJsonStr);
        expect(currentJson["sources"].length).toBe(4);
    });
});
