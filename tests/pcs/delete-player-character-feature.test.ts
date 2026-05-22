import { DeletePlayerCharacterFeature } from "../../src/features/player-characters/delete-player-character/delete-player-character-feature";
import { DeletePlayerCharacterRequest } from "../../src/features/player-characters/delete-player-character/delete-player-character-request";
import { PlayerCharacter } from "../../src/features/player-characters/player-character";
import { GetAllPlayerCharactersFeature } from "../../src/features/player-characters/get-all-player-characters/get-all-player-characters-feature";
import { PlayerCharacterListItem } from "../../src/features/player-characters/player-character-list-item";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { DatabaseTestUtils } from "../helpers/database-test-utils";

describe("DeletePlayerCharacterFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: DeletePlayerCharacterRequest;
    let feature: DeletePlayerCharacterFeature;
    let largestPcId: number;
    let originalNumberOfPcsInDatabase: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestPcId = DatabaseTestUtils.getLargestDatabaseEntityId(unitOfWork.repo(PlayerCharacter));

        setOriginalCount();

        request = new DeletePlayerCharacterRequest();
        feature = new DeletePlayerCharacterFeature(unitOfWork);
    });

    afterEach(async () => {
        DatabaseTestUtils.resetDatabaseEntityCollection(unitOfWork.repo(PlayerCharacter), largestPcId);

        await unitOfWork.saveChanges();
    });

    it("should succeed if the player character does not exist", async () => {
        // Arrange
        request.id = -1;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(-1);
        assertNoPlayerCharactersDeletedFromDatabase();
    });

    it("should succeed and delete the player character from the database", async () => {
        // Arrange
        const pc = new PlayerCharacter(0, "PC to Delete", "Teamster", "Delete me!");
        pc.saveToDatabase(unitOfWork);
        await unitOfWork.saveChanges();

        const pcId = pc.id;
        request.id = pcId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const deletedPc = unitOfWork.repo(PlayerCharacter).first((p) => p.id === pcId);
        const countAfterDelete = unitOfWork.repo(PlayerCharacter).list().length;

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(pcId);
        expect(deletedPc).toBeUndefined();
        expect(countAfterDelete).toBe(originalNumberOfPcsInDatabase);
    });

    it("should succeed for any player character (all PCs are deletable)", async () => {
        // Arrange — use a seeded player character with id 1
        request.id = 1;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(1);
    });

    function setOriginalCount() {
        const getAllFeature = new GetAllPlayerCharactersFeature(unitOfWork);
        const pcs: PlayerCharacterListItem[] = getAllFeature.handle(new EmptyRequest());
        originalNumberOfPcsInDatabase = pcs.length;
    }

    function assertNoPlayerCharactersDeletedFromDatabase() {
        const count = unitOfWork.repo(PlayerCharacter).list().length;
        expect(count).toBe(originalNumberOfPcsInDatabase);
    }
});
