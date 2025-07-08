import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { NonDatabaseEntity } from "../models/non-database-entity";
import { DataAccessUtils } from "./data-access-utils";

describe("UnitOfWork", () => {
    beforeEach(() => {
        DataAccessUtils.clearLocalStorage();
    });

    it("should throw an exception when attempting to call a data-access operation against a non-database entity", () => {
        const dbContext = DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);

        expect(() => {
            unitOfWork.repo(NonDatabaseEntity).list();
        }).toThrow(`DbSet of type ${NonDatabaseEntity.name} not found.`);
    });
});
