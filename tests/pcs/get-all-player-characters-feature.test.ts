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

        let playerCharacter = PlayerCharacterTestUtils.getPlayerCharacterItemByName(result, "The 4YourEyez Algorithm");
        expect(playerCharacter.id).toBe(1);
        expect(playerCharacter.name).toBe("The 4YourEyez Algorithm");

        playerCharacter = PlayerCharacterTestUtils.getPlayerCharacterItemByName(result, "Angels");
        expect(playerCharacter.id).toBe(2);
        expect(playerCharacter.name).toBe("Angels");

        playerCharacter = PlayerCharacterTestUtils.getPlayerCharacterItemByName(result, "Belladonnas");
        expect(playerCharacter.id).toBe(3);
        expect(playerCharacter.name).toBe("Belladonnas");
    });
});
