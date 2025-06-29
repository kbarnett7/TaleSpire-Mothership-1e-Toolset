import { FilterNpcsListFeature } from "../../src/features/npcs/filter-npcs-list/filter-npcs-list-feature";
import { FilterNpcsListRequest } from "../../src/features/npcs/filter-npcs-list/filter-npcs-list-request";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { UnitTestDatabase } from "../data/unit-test-database";

describe("FilterNpcsListFeature", () => {
    let feature: FilterNpcsListFeature;
    let request: FilterNpcsListRequest;

    beforeEach(() => {
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);

        feature = new FilterNpcsListFeature(unitOfWork);
        request = new FilterNpcsListRequest();
    });
});
