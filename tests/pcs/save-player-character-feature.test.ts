import { SavePlayerCharacterFeature } from "../../src/features/player-characters/save-player-character/save-player-character-feature";
import { SavePlayerCharacterRequest } from "../../src/features/player-characters/save-player-character/save-player-character-request";
import { PlayerCharacter } from "../../src/features/player-characters/player-character";
import { PlayerCharacterFormFieldsDto } from "../../src/features/player-characters/player-character-form-fields-dto";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";
import { DatabaseTestUtils } from "../helpers/database-test-utils";
import { ValueUtils } from "../helpers/value-utils";

describe("SavePlayerCharacterFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: SavePlayerCharacterRequest;
    let feature: SavePlayerCharacterFeature;
    let largestPcId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestPcId = DatabaseTestUtils.getLargestDatabaseEntityId(unitOfWork.repo(PlayerCharacter));

        request = new SavePlayerCharacterRequest();
        feature = new SavePlayerCharacterFeature(unitOfWork);
    });

    afterEach(async () => {
        DatabaseTestUtils.resetDatabaseEntityCollection(unitOfWork.repo(PlayerCharacter), largestPcId);

        await unitOfWork.saveChanges();
    });

    it("should fail if there is an unexpected exception when adding a new player character", async () => {
        // Arrange
        request.formFields = getValidFormFields();

        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    it("should fail if there is an unexpected exception when editing an existing player character", async () => {
        // Arrange
        const pcId = await addBasePcToDatabase();
        request.formFields = getValidEditedFormFields();
        request.id = pcId;

        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    it("should have create error code when adding a player character fails", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.name = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
    });

    it("should have edit error code when editing a player character fails", async () => {
        // Arrange
        const pcId = await addBasePcToDatabase();
        const formFields = getValidEditedFormFields();
        formFields.name = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = formFields;
        request.id = pcId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editPlayerCharacterFailed),
        );
    });

    it.each([[""], [" "]])("should fail if the name is empty or whitespace", async (name: string) => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.name = name;
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("empty");
    });

    it("should fail if the name is greater than 100 characters long", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.name = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("100");
    });

    it("should fail when adding a player character if another with the same name already exists", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.name = "Android A";
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Android A");
        expect(result.error.details[0]).toContain("already exists");
    });

    it.each([[""], [" "]])("should fail if the character class is empty or whitespace", async (cls: string) => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.characterClass = cls;
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("class");
        expect(result.error.details[0]).toContain("empty");
    });

    it("should fail if the character class is greater than 100 characters long", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.characterClass = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("class");
        expect(result.error.details[0]).toContain("100");
    });

    it("should fail if the description is greater than 5000 characters long", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.description = ValueUtils.getStringOfRandomCharacters(5001);
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("description");
        expect(result.error.details[0]).toContain("5,000");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the strength is negative or contains non-digit characters",
        async (strength: string) => {
            // Arrange
            const formFields = getValidFormFields();
            formFields.strength = strength;
            request.formFields = formFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("strength");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        },
    );

    it("should fail if the strength is greater than 100", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.strength = "101";
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("strength");
        expect(result.error.details[0]).toContain("100");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the speed is negative or contains non-digit characters",
        async (speed: string) => {
            // Arrange
            const formFields = getValidFormFields();
            formFields.speed = speed;
            request.formFields = formFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("speed");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        },
    );

    it("should fail if the speed is greater than 100", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.speed = "101";
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("speed");
        expect(result.error.details[0]).toContain("100");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the intellect is negative or contains non-digit characters",
        async (intellect: string) => {
            // Arrange
            const formFields = getValidFormFields();
            formFields.intellect = intellect;
            request.formFields = formFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("intellect");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        },
    );

    it("should fail if the intellect is greater than 100", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.intellect = "101";
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("intellect");
        expect(result.error.details[0]).toContain("100");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the combat is negative or contains non-digit characters",
        async (combat: string) => {
            // Arrange
            const formFields = getValidFormFields();
            formFields.combat = combat;
            request.formFields = formFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("combat");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        },
    );

    it("should fail if the combat is greater than 100", async () => {
        // Arrange
        const formFields = getValidFormFields();
        formFields.combat = "101";
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createPlayerCharacterFailed),
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("combat");
        expect(result.error.details[0]).toContain("100");
    });

    it("should add a valid player character to the database with an incremented ID", async () => {
        // Arrange
        const countPreAdd = unitOfWork.repo(PlayerCharacter).list().length;
        const formFields = getValidFormFields();
        request.formFields = formFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countPostAdd = unitOfWork.repo(PlayerCharacter).list().length;
        const itemFromDatabase =
            unitOfWork.repo(PlayerCharacter).first((item) => item.id === result.value?.id) ?? new PlayerCharacter();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(countPostAdd).toBe(countPreAdd + 1);
        expect(itemFromDatabase.id).toBe(largestPcId + 1);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.name).toBe(formFields.name);
        expect(itemFromDatabase.characterClass).toBe(formFields.characterClass);
        expect(itemFromDatabase.description).toBe(formFields.description);
    });

    it("should save an edited player character with valid changes to the database", async () => {
        // Arrange
        const pcId = await addBasePcToDatabase();
        const formFields = getValidEditedFormFields();
        const countPreEdit = unitOfWork.repo(PlayerCharacter).list().length;
        request.formFields = formFields;
        request.id = pcId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countPostEdit = unitOfWork.repo(PlayerCharacter).list().length;
        const itemFromDatabase =
            unitOfWork.repo(PlayerCharacter).first((item) => item.id === result.value?.id) ?? new PlayerCharacter();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(countPostEdit).toBe(countPreEdit);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.name).toBe(formFields.name);
        expect(itemFromDatabase.characterClass).toBe(formFields.characterClass);
        expect(itemFromDatabase.description).toBe(formFields.description);
    });

    it("should save an edited player character when the name was not changed", async () => {
        // Arrange
        const pcId = await addBasePcToDatabase();
        const formFields = getValidEditedFormFields();
        formFields.name = "Test PC to Edit";
        const countPreEdit = unitOfWork.repo(PlayerCharacter).list().length;
        request.formFields = formFields;
        request.id = pcId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countPostEdit = unitOfWork.repo(PlayerCharacter).list().length;

        expect(result.isSuccess).toBe(true);
        expect(countPostEdit).toBe(countPreEdit);
    });

    it("should add a player character with a non-zero ID that does not exist in the database", async () => {
        // Arrange
        const nonExistentId = largestPcId + 10;
        const formFields = getValidFormFields();
        const countPreEdit = unitOfWork.repo(PlayerCharacter).list().length;
        request.formFields = formFields;
        request.id = nonExistentId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countPostEdit = unitOfWork.repo(PlayerCharacter).list().length;
        const itemFromDatabase =
            unitOfWork.repo(PlayerCharacter).first((item) => item.id === result.value?.id) ?? new PlayerCharacter();

        expect(result.isSuccess).toBe(true);
        expect(countPostEdit).toBe(countPreEdit + 1);
        expect(itemFromDatabase.id).not.toBe(nonExistentId);
        expect(itemFromDatabase.name).toBe(formFields.name);
    });

    function getValidFormFields(): PlayerCharacterFormFieldsDto {
        return new PlayerCharacterFormFieldsDto(
            "Test Custom PC",
            "Marine",
            "A marine created for testing.",
            "25",
            "30",
            "35",
            "40",
        );
    }

    function getValidEditedFormFields(): PlayerCharacterFormFieldsDto {
        return new PlayerCharacterFormFieldsDto(
            "Edited Test PC",
            "Scientist",
            "An edited description.",
            "30",
            "35",
            "40",
            "45",
        );
    }

    async function addBasePcToDatabase(): Promise<number> {
        const pc = new PlayerCharacter(0, "Test PC to Edit", "Marine", "Edit me!");

        pc.saveToDatabase(unitOfWork);

        await unitOfWork.saveChanges();

        return pc.id;
    }
});
