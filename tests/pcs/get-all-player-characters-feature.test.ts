import { GetAllPlayerCharactersFeature } from "../../src/features/player-characters/get-all-player-characters/get-all-player-characters-feature";
import { PlayerCharacterListItem } from "../../src/features/player-characters/player-character-list-item";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { PlayerCharacterTestUtils } from "./player-character-test-utils";

describe("GetAllPlayerCharacters Feature", () => {
    it("Returns all Player Characters", async () => {
        // Arrange
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);
        const feature = new GetAllPlayerCharactersFeature(unitOfWork);

        // Act
        const result: PlayerCharacterListItem[] = feature.handle(new EmptyRequest());

        // Assert
        expect(result.length).toBeGreaterThan(0);

        let playerCharacter = PlayerCharacterTestUtils.getPlayerCharacterItemByName(result, "Test Android A");
        expect(playerCharacter.id).toBe(1);
        expect(playerCharacter.name).toBe("Test Android A");

        playerCharacter = PlayerCharacterTestUtils.getPlayerCharacterItemByName(result, "Test Teamster A");
        expect(playerCharacter.id).toBe(4);
        expect(playerCharacter.name).toBe("Test Teamster A");
    });
});
