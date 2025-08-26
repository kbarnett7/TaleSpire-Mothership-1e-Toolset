import { ArmorItem } from "../../src/features/gear/armor-item";
import { IDatabaseContext } from "../../src/lib/common/data-access/database-context-interface";
import { IUnitOfWork } from "../../src/lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { NonDatabaseEntity } from "../models/non-database-entity";
import { DataAccessUtils } from "./data-access-utils";

describe("UnitOfWork", () => {
    let dbContext: IDatabaseContext;
    let unitOfWork: IUnitOfWork;

    beforeEach(async () => {
        DataAccessUtils.clearLocalStorage();

        dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);
    });

    it("should throw an exception when attempting to call a data-access operation against a non-database entity", () => {
        expect(() => {
            unitOfWork.repo(NonDatabaseEntity).list();
        }).toThrow(`DbSet of type ${NonDatabaseEntity.name} not found.`);
    });

    it("should return the entity collection when calling a query operation against a database entity", () => {
        const armorItems = unitOfWork.repo(ArmorItem).list();

        expect(armorItems.length).toBeGreaterThan(0);
    });

    it("should persist changes to the JSON database when saving changes", async () => {
        const originalNumberOfArmorItemsInDatabase: number = unitOfWork.repo(ArmorItem).list().length;
        const newArmor = new ArmorItem(9999, 1, "Unit Test Armor", "Armor used by unit tests.");
        unitOfWork.repo(ArmorItem).add(newArmor);

        await unitOfWork.saveChanges();

        dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);
        const length = unitOfWork.repo(ArmorItem).list().length;
        const lastItem = unitOfWork.repo(ArmorItem).list()[length - 1];
        expect(length).toBe(originalNumberOfArmorItemsInDatabase + 1);
        expect(lastItem.id).toBe(9999);
        expect(lastItem.name).toBe("Unit Test Armor");
    });
});
