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
import { ValueUtils } from "../helpers/value-utils";

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
        const npcFormFields = getValidCustomNpcFormFields();

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

    it("should have create error code info when adding an equipment item fails", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.name = ValueUtils.getStringOfRandomCharacters(101);

        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
    });

    it.each([[""], [" "]])("should fail if the name is empty or whitespace", async (name: string) => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.name = name;
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("empty");
    });

    it("should fail if the name is greater than 100 characters long", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.name = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("100");
    });

    it("should fail if the description is greater than 5000 characters long", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.description = ValueUtils.getStringOfRandomCharacters(5001);
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("description");
        expect(result.error.details[0]).toContain("5,000");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the combat is negative or contains non-digit characters",
        async (combat: string) => {
            // Arrange
            const npcFormFields = getValidCustomNpcFormFields();
            npcFormFields.combat = combat;
            request.formFields = npcFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("combat");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail if the combat is greater than 100", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.combat = "101";
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("combat");
        expect(result.error.details[0]).toContain("100");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the instinct is negative or contains non-digit characters",
        async (instinct: string) => {
            // Arrange
            const npcFormFields = getValidCustomNpcFormFields();
            npcFormFields.instinct = instinct;
            request.formFields = npcFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("instinct");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail if the instinct is greater than 100", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.instinct = "101";
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("instinct");
        expect(result.error.details[0]).toContain("100");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the armor points is negative or contains non-digit characters",
        async (armorPoints: string) => {
            // Arrange
            const npcFormFields = getValidCustomNpcFormFields();
            npcFormFields.armorPoints = armorPoints;
            request.formFields = npcFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("armor points");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail if the armor points is greater than 10", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.armorPoints = "11";
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("armor points");
        expect(result.error.details[0]).toContain("10");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the health is negative or contains non-digit characters",
        async (health: string) => {
            // Arrange
            const npcFormFields = getValidCustomNpcFormFields();
            npcFormFields.health = health;
            request.formFields = npcFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("health");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail if the health is greater than 1000", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.health = "1001";
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("health");
        expect(result.error.details[0]).toContain("1,000");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the maximum wounds is negative or contains non-digit characters",
        async (maximumWounds: string) => {
            // Arrange
            const npcFormFields = getValidCustomNpcFormFields();
            npcFormFields.maximumWounds = maximumWounds;
            request.formFields = npcFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("maximum wounds");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail if the maximum wounds is greater than 100", async () => {
        // Arrange
        const npcFormFields = getValidCustomNpcFormFields();
        npcFormFields.maximumWounds = "101";
        request.formFields = npcFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("maximum wounds");
        expect(result.error.details[0]).toContain("100");
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
        return new NpcFormFieldsDto(
            "Test Custom NPC",
            "A custom NPC created for unit testing.",
            "40",
            "35",
            "2",
            "20",
            "3"
        );
    }
});
