import { GetPlayerCharacterByIdFeature } from "../../src/features/player-characters/get-player-character-by-id/get-player-character-by-id-feature";
import { GetPlayerCharacterByIdRequest } from "../../src/features/player-characters/get-player-character-by-id/get-player-character-by-id-request";
import { PlayerCharacter } from "../../src/features/player-characters/player-character";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("GetPlayerCharacterById Feature", () => {
    let unitOfWork: UnitOfWork;
    let feature: GetPlayerCharacterByIdFeature;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);
        feature = new GetPlayerCharacterByIdFeature(unitOfWork);
    });

    it("Returns an empty PlayerCharacter when given id 0", () => {
        // Arrange
        const request = new GetPlayerCharacterByIdRequest(0);

        // Act
        const result: PlayerCharacter = feature.handle(request);

        // Assert
        expect(result.id).toBe(0);
        expect(result.name).toBe("");
        expect(result.characterClassId).toBe(0);
        expect(result.description).toBe("");
    });

    it("Returns the correct PlayerCharacter when given a valid id", () => {
        // Arrange
        const request = new GetPlayerCharacterByIdRequest(1);

        // Act
        const result: PlayerCharacter = feature.handle(request);

        // Assert
        expect(result.id).toBe(1);
        expect(result.name).toBe("Android A");
        expect(result.characterClassId).toBe(2);
        expect(result.baseStrength).toBe(32);
        expect(result.baseSpeed).toBe(25);
        expect(result.baseIntellect).toBe(40);
        expect(result.baseCombat).toBe(30);
        expect(result.baseSanity).toBe(20);
        expect(result.baseFear).toBe(20);
        expect(result.baseBody).toBe(25);
        expect(result.strength).toBe(32);
        expect(result.speed).toBe(25);
        expect(result.intellect).toBe(60);
        expect(result.combat).toBe(20);
        expect(result.sanity).toBe(20);
        expect(result.fear).toBe(80);
        expect(result.body).toBe(25);
    });

    it("Returns an empty PlayerCharacter when given a non-existent id", () => {
        // Arrange
        const request = new GetPlayerCharacterByIdRequest(99999);

        // Act
        const result: PlayerCharacter = feature.handle(request);

        // Assert
        expect(result.id).toBe(0);
    });
});
