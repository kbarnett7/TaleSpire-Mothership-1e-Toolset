import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { GetNpcByIdFeature } from "../../src/features/npcs/get-npc-by-id/get-npc-by-id-feature";
import { GetNpcByIdRequest } from "../../src/features/npcs/get-npc-by-id/get-npc-by-id-request";
import { Npc } from "../../src/features/npcs/npc";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("GetNpcByIdFeature", () => {
    const jsonDatabaseFilePath = "./tests/data/json/database.json";

    let feature: GetNpcByIdFeature;

    beforeEach(() => {
        const dbContext = DataAccessUtils.getInitializedDbContext(jsonDatabaseFilePath);
        const unitOfWork = new UnitOfWork(dbContext);
        feature = new GetNpcByIdFeature(unitOfWork);
    });

    it("With id of 0 returns empty NPC object", () => {
        // Arrange
        const request = new GetNpcByIdRequest(0);

        // Act
        const npc: Npc = feature.handle(request);

        // Assert
        expect(npc.id).toBe(0);
        expect(npc.sourceId).toBe(0);
        expect(npc.name).toBe("");
        expect(npc.combat).toBe(0);
        expect(npc.instinct).toBe(0);
        expect(npc.armorPoints).toBe(0);
        expect(npc.health).toBe(0);
        expect(npc.maximumWounds).toBe(0);
        expect(npc.attacks.length).toBe(0);
        expect(npc.specialAbilities.length).toBe(0);
    });

    it("With id of 3 returns NPC object with an id of 3 and name 'Belladonnas'", () => {
        // Arrange
        const request = new GetNpcByIdRequest(3);

        // Act
        const npc: Npc = feature.handle(request);

        // Assert
        expect(npc.id).toBe(3);
        expect(npc.sourceId).toBe(3);
        expect(npc.name).toBe("Belladonnas");
        expect(npc.combat).toBe(75);
        expect(npc.instinct).toBe(75);
        expect(npc.armorPoints).toBe(10);
        expect(npc.health).toBe(30);
        expect(npc.maximumWounds).toBe(3);
        expect(npc.attacks.length).toBe(1);
        expect(npc.attacks[0].name).toBe("Talons");
        expect(npc.attacks[0].effect).toBe("4d10");
        expect(npc.specialAbilities.length).toBe(1);
        expect(npc.specialAbilities[0].description).toBe("Tail Poison: Body Saved [-] or 1d10 DMG/round.");
    });
});
