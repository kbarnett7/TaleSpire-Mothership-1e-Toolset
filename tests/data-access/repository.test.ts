import { DatabaseVersion } from "../../src/features/database-versions/database-version";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { IDatabaseContext } from "../../src/lib/common/data-access/database-context-interface";
import { DbSet } from "../../src/lib/common/data-access/db-set";
import { Repository } from "../../src/lib/data-access/repository";
import { DataAccessUtils } from "./data-access-utils";

describe("Repository", () => {
    let dbContext: IDatabaseContext;

    beforeEach(() => {
        DataAccessUtils.clearLocalStorage();
        dbContext = DataAccessUtils.getInitializedDbContext();
    });

    it("should return return an empty array when listing the entities in an empty DB set", () => {
        const repository = new Repository(DatabaseVersion, dbContext);
        clearDbSet(dbContext, dbContext.getSet(DatabaseVersion));

        const result = repository.list();

        expect(result.length).toBe(0);
    });

    it("should return a populated array when listing the entities in a populated DB set", () => {
        const repository = new Repository(DatabaseVersion, dbContext);

        const result = repository.list();

        expect(result.length).toBeGreaterThan(0);
    });

    it("should return undefined when finding the first entity without a predicate from an empty DB set", () => {
        const repository = new Repository(DatabaseVersion, dbContext);
        clearDbSet(dbContext, dbContext.getSet(DatabaseVersion));

        const result = repository.first();

        expect(result).toBeUndefined();
    });

    it("should return the first entity when finding the first entity without a predicate", () => {
        const repository = new Repository(ArmorItem, dbContext);

        const result = repository.first();

        expect(result).toBeDefined();
        expect(result?.id).toBe(1);
        expect(result?.name).toBe("Standard Crew Attire");
    });

    it("should add an entity to a DB set when given a new entity", () => {
        const repository = new Repository(ArmorItem, dbContext);
        const originalLength = repository.list().length;
        const newEntity = new ArmorItem(99, 1, "Test Armor");

        repository.add(newEntity);
        dbContext.saveChanges();

        const entities = repository.list();
        expect(entities.length).toBe(originalLength + 1);
        expect(entities[originalLength].id).toBe(99);
        expect(entities[originalLength].name).toBe("Test Armor");
    });

    function clearDbSet<T>(dbContext: IDatabaseContext, dbSet: DbSet<T>) {
        for (const element of dbSet.toArray()) {
            dbSet.remove(element);
        }

        dbContext.saveChanges();
    }
});
