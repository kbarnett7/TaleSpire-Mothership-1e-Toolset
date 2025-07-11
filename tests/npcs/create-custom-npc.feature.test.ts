import { CreateCustomNpcFeature } from "../../src/features/npcs/create-custom-npc/create-custom-npc-feature";
import { CreateCustomNpcRequest } from "../../src/features/npcs/create-custom-npc/create-custom-npc-request";
import { Npc } from "../../src/features/npcs/npc";
import { NpcAttack } from "../../src/features/npcs/npc-attack";
import { NpcSpecialAbility } from "../../src/features/npcs/npc-special-ability";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { Result } from "../../src/lib/result/result";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("CreateCustomNpcFeature", () => {
    const fiftyCharacterLongName: string = "Lorem ipsum dolor sit amet consectetur adipiscingel";

    let request: CreateCustomNpcRequest;
    let feature: CreateCustomNpcFeature;

    beforeEach(() => {
        const dbContext = DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);

        request = new CreateCustomNpcRequest();
        feature = new CreateCustomNpcFeature(unitOfWork);
    });

    it.each([[""], [" "]])("should fail if the name is empty or whitespace", (name: string) => {
        // Arrange
        const npc: Npc = getValidCustomNpc();
        npc.name = name;
        request.npc = npc;

        // Act
        const result = feature.handle(request);

        // Assert
        expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("empty");
    });

    it("should fail if the name is greater than 50 characters long", () => {
        // Arrange
        const npc: Npc = getValidCustomNpc();
        npc.name = fiftyCharacterLongName;
        request.npc = npc;

        // Act
        const result = feature.handle(request);

        // Assert
        expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("50");
    });

    function expectResultToBeFailure(actual: Result<any>, expectedCode: string, expectedDescription: string) {
        expect(actual.isFailure).toBe(true);
        expect(actual.value).not.toBeDefined();
        expect(actual.error).toBeDefined();
        expect(actual.error.code).toBe(expectedCode);
        expect(actual.error.description).toBe(expectedDescription);
    }

    function getValidCustomNpc(): Npc {
        return new Npc(
            999,
            1,
            "Custom Test NPC",
            35,
            40,
            3,
            25,
            2,
            "This is a fake NPC used for testing.",
            [
                new NpcAttack("Fake Attack 1", "1d10"),
                new NpcAttack("Fake Attack 2", "Sanity save or become stunned for one round."),
            ],
            [
                new NpcSpecialAbility("Test Ability 1: Does scary stuff."),
                new NpcSpecialAbility("Test Ability 2: More scary stuff."),
            ]
        );
    }
});
