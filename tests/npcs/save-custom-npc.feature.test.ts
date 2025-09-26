import { SaveCustomNpcFeature } from "../../src/features/npcs/save-custom-npc/save-custom-npc-feature";
import { SaveCustomNpcRequest } from "../../src/features/npcs/save-custom-npc/save-custom-npc-request";
import { Npc } from "../../src/features/npcs/npc";
import { NpcAttack } from "../../src/features/npcs/npc-attack";
import { NpcSpecialAbility } from "../../src/features/npcs/npc-special-ability";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";
import { NpcTestUtils } from "./npc-test-utils";
import { DatabaseTestUtils } from "../helpers/database-test-utils";
import { NpcFormFieldsDto } from "../../src/features/npcs/npc-form-fields-dto";

describe("SaveCustomNpcFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: SaveCustomNpcRequest;
    let feature: SaveCustomNpcFeature;
    let largestNpcId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestNpcId = DatabaseTestUtils.getLargestDatabaseEntityId(unitOfWork.repo(Npc));

        request = new SaveCustomNpcRequest();
        feature = new SaveCustomNpcFeature(unitOfWork);
    });

    afterEach(async () => {
        DatabaseTestUtils.resetDatabaseEntityCollection(unitOfWork.repo(Npc), largestNpcId);

        await unitOfWork.saveChanges();
    });

    it("should fail if there is an unexpected exception when adding a new NPC", async () => {
        // Arrange
        const npcFormFields: NpcFormFieldsDto = getValidCustomNpcFormFields();

        request.formFields = npcFormFields;

        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    function getValidCustomNpcFormFields(): NpcFormFieldsDto {
        // return new Npc(
        //     999,
        //     1,
        //     "Custom Test NPC",
        //     35,
        //     40,
        //     3,
        //     25,
        //     2,
        //     "This is a fake NPC used for testing.",
        //     [
        //         new NpcAttack("Fake Attack 1", "1d10"),
        //         new NpcAttack("Fake Attack 2", "Sanity save or become stunned for one round."),
        //     ],
        //     [
        //         new NpcSpecialAbility("Test Ability 1: Does scary stuff."),
        //         new NpcSpecialAbility("Test Ability 2: More scary stuff."),
        //     ]
        // );
        return new NpcFormFieldsDto();
    }
});
