import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { GetCharacterClassByIdFeature } from "../../src/features/character-class/get-character-class-by-id/get-character-class-by-id-feature";
import { GetCharacterClassByIdRequest } from "../../src/features/character-class/get-character-class-by-id/get-character-class-by-id-request";
import { CharacterClass } from "../../src/features/character-class/character-class";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("GetCharacterClassByIdFeature", () => {
    let feature: GetCharacterClassByIdFeature;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);
        feature = new GetCharacterClassByIdFeature(unitOfWork);
    });

    it("With id of 0 returns empty character class object", () => {
        // Arrange
        const request = new GetCharacterClassByIdRequest(0);

        // Act
        const characterClass: CharacterClass = feature.handle(request);

        // Assert
        expect(characterClass.id).toBe(0);
        expect(characterClass.sourceId).toBe(0);
        expect(characterClass.name).toBe("");
    });

    it("With id of 3 returns character class object with an id of 3 and name 'Scientist'", () => {
        // Arrange
        const request = new GetCharacterClassByIdRequest(3);

        // Act
        const npc: CharacterClass = feature.handle(request);

        // Assert
        expect(npc.id).toBe(3);
        expect(npc.sourceId).toBe(2);
        expect(npc.name).toBe("Scientist");
    });
});
