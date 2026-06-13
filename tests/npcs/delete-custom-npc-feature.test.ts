import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DeleteCustomNpcRequest } from "../../src/features/npcs/delete-custom-npc/delete-custom-npc-request";
import { DeleteCustomNpcFeature } from "../../src/features/npcs/delete-custom-npc/delete-custom-npc-feature";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { DatabaseTestUtils } from "../helpers/database-test-utils";
import { Npc } from "../../src/features/npcs/npc";
import { NpcListItem } from "../../src/features/npcs/npc-list-item";
import { GetAllNpcsFeature } from "../../src/features/npcs/get-all-npcs/get-all-npcs-feature";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { AssertUtils } from "../helpers/assert-utils";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { NpcAttack } from "../../src/features/npcs/npc-attack";
import { NpcSpecialAbility } from "../../src/features/npcs/npc-special-ability";

describe("DeleteCustomNpcFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: DeleteCustomNpcRequest;
    let feature: DeleteCustomNpcFeature;
    let largestNpcId: number;
    let originalNumberOfNpcsInDatabase: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestNpcId = DatabaseTestUtils.getLargestDatabaseEntityId(unitOfWork.repo(Npc));

        setOriginalNumberOfGearItemsIdInDatabase();

        request = new DeleteCustomNpcRequest();
        feature = new DeleteCustomNpcFeature(unitOfWork);
    });

    afterEach(async () => {
        DatabaseTestUtils.resetDatabaseEntityCollection(unitOfWork.repo(Npc), largestNpcId);

        await unitOfWork.saveChanges();
    });

    it("should succeed if the NPC does not exist", async () => {
        // Arrange
        request.id = -1;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value).toBe(-1);
        assertNoNpcsDeletedFromDatabase();
    });

    it("should fail if the NPC is not a custom NPC", async () => {
        // Arrange
        request.id = 1;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.DeleteError,
            LocalizationService.instance.translate(MessageKeys.deleteCustomNpcFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("not");
        expect(result.error.details[0]).toContain("custom");
        assertNoNpcsDeletedFromDatabase();
    });

    it("should succeed for a custom NPC that exists", async () => {
        // Arrange
        const npcId = largestNpcId + 1;
        const npc = getValidCustomNpc();
        npc.saveToDatabase(unitOfWork);
        await unitOfWork.saveChanges();
        request.id = npcId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countNpcsInDatabase = unitOfWork.repo(Npc).list().length;
        const deletedNpc = unitOfWork.repo(Npc).first((npc) => npc.id === request.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value).toBe(npcId);
        expect(countNpcsInDatabase).toBe(originalNumberOfNpcsInDatabase);
        expect(deletedNpc).toBeUndefined();
    });

    function setOriginalNumberOfGearItemsIdInDatabase(): void {
        const feature = new GetAllNpcsFeature(unitOfWork);
        const npcs: NpcListItem[] = feature.handle(new EmptyRequest());

        originalNumberOfNpcsInDatabase = npcs.length;
    }

    function getValidCustomNpc(): Npc {
        return new Npc(
            0,
            0,
            "Test Custom NPC",
            "A custom NPC created for unit testing.",
            40,
            35,
            2,
            20,
            3,
            [
                new NpcAttack("Fake Attack 1", "1d10"),
                new NpcAttack("Fake Attack 2", "Sanity save or become stunned for one round."),
            ],
            [
                new NpcSpecialAbility("Test Ability 1", "Does scary stuff."),
                new NpcSpecialAbility("Test Ability 2", "More scary stuff."),
            ],
        );
    }

    function assertNoNpcsDeletedFromDatabase() {
        const countNpcsInDatabase = unitOfWork.repo(Npc).list().length;

        expect(countNpcsInDatabase).toBe(originalNumberOfNpcsInDatabase);
    }
});
