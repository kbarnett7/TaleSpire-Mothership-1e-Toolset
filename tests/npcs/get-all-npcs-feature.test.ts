import { GetAllNpcsFeature } from "../../src/features/npcs/get-all-npcs/get-all-npcs-feature";
import { NpcListItem } from "../../src/features/npcs/npc-list-item";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { UnitTestDatabase } from "../data/unit-test-database";
import { NpcTestUtils } from "./npc-test-utils";

describe("GetAllNpcs Feature", () => {
    it("Returns all NPCs", () => {
        // Arrange
        const dbContext = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(dbContext);
        const feature = new GetAllNpcsFeature(unitOfWork);

        // Act
        const result: NpcListItem[] = feature.handle(new EmptyRequest());

        // Assert
        expect(result.length).toBeGreaterThan(0);

        let npc = NpcTestUtils.getNpcItemByName(result, "The 4YourEyez Algorithm");
        expect(npc.id).toBe(1);
        expect(npc.name).toBe("The 4YourEyez Algorithm");

        npc = NpcTestUtils.getNpcItemByName(result, "Angels");
        expect(npc.id).toBe(2);
        expect(npc.name).toBe("Angels");

        npc = NpcTestUtils.getNpcItemByName(result, "Belladonnas");
        expect(npc.id).toBe(3);
        expect(npc.name).toBe("Belladonnas");
    });
});
