import { SaveCustomEquipmentItemRequest } from "../../src/features/gear/save-custom-equipment-item/save-custom-equipment-item-request";
import { SaveCustomEquipmentItemFeature } from "../../src/features/gear/save-custom-equipment-item/save-custom-equipment-item-feature";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { EquipmentItemFormFieldsDto } from "../../src/features/gear/equipment-item-form-fields-dto";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { AssertUtils } from "../helpers/assert-utils";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { ValueUtils } from "../helpers/value-utils";
import { GearTestUtils } from "./gear-test-utils";

describe("SaveCustomEquipmentItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: SaveCustomEquipmentItemRequest;
    let feature: SaveCustomEquipmentItemFeature;
    let largestEquipmentId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestEquipmentId = GearTestUtils.getLargestGearItemIdInDatabase(unitOfWork.repo(EquipmentItem));

        request = new SaveCustomEquipmentItemRequest();
        feature = new SaveCustomEquipmentItemFeature(unitOfWork);
    });

    afterEach(async () => {
        GearTestUtils.resetGearItemListInDatabase(unitOfWork.repo(EquipmentItem), largestEquipmentId);

        await unitOfWork.saveChanges();
    });

    it("should fail if there is an unexpected exception when adding a new equipment item", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.description = ValueUtils.getStringOfRandomCharacters(1001);
        request.formFields = equipmentItemFormFields;

        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    it("should fail if there is an unexpected exception when editing an existing equipment item", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();

        request.formFields = equipmentItemFormFields;
        request.id = equipmentItemId;

        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editCustomEquipmentItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    it("should have create error code info when adding an equipment item fails", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.name = ValueUtils.getStringOfRandomCharacters(101);

        request.formFields = equipmentItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
        );
    });

    it("should have edit error code info when editing an equipment item fails", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();

        equipmentItemFormFields.name = ValueUtils.getStringOfRandomCharacters(101);

        request.formFields = equipmentItemFormFields;
        request.id = equipmentItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editCustomEquipmentItemFailed)
        );
    });

    it.each([[""], [" "]])("should fail if the name is empty or whitespace", async (name: string) => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.name = name;
        request.formFields = equipmentItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("empty");
    });

    it("should fail if the name is greater than 100 characters long", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.name = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = equipmentItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("100");
    });

    it("should fail if the description is greater than 1000 characters long", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.description = ValueUtils.getStringOfRandomCharacters(1001);
        request.formFields = equipmentItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("description");
        expect(result.error.details[0]).toContain("1,000");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if the cost is negative or contains non-digit characters",
        async (cost: string) => {
            // Arrange
            const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
            equipmentItemFormFields.cost = cost;
            request.formFields = equipmentItemFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("cost");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail when adding an equipment item if there already exists an equipment item with the same name in the database", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.name = "Binoculars";
        request.formFields = equipmentItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("Binoculars");
        expect(result.error.details[0]).toContain("already exists");
    });

    it("should add a valid equipment item to the database with an incremented ID and the source set to custom", async () => {
        // Arrange
        const numberOfEquipmentInDatabasePreAdd = unitOfWork.repo(EquipmentItem).list().length;
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        request.formFields = equipmentItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfEquipmentInDatabasePostAdd = unitOfWork.repo(EquipmentItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(EquipmentItem).first((item) => item.id == result.value?.id) ?? new EquipmentItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfEquipmentInDatabasePostAdd).toBe(numberOfEquipmentInDatabasePreAdd + 1);
        expect(itemFromDatabase.id).toBe(largestEquipmentId + 1);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.name).toBe(result.value?.name);
        expect(itemFromDatabase.description).toBe(result.value?.description);
        expect(itemFromDatabase.cost).toBe(result.value?.cost);
    });

    it("should fail when editing an equipment item to have the same name as another equipment item in the database", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();

        equipmentItemFormFields.name = "Binoculars";

        request.formFields = equipmentItemFormFields;
        request.id = equipmentItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editCustomEquipmentItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("Binoculars");
        expect(result.error.details[0]).toContain("already exists");
    });

    it("should save an edited equipment item with valid changes to the database", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();
        const numberOfEquipmentInDatabasePreEdit = unitOfWork.repo(EquipmentItem).list().length;

        request.formFields = equipmentItemFormFields;
        request.id = equipmentItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfEquipmentInDatabasePostEdit = unitOfWork.repo(EquipmentItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(EquipmentItem).first((item) => item.id == result.value?.id) ?? new EquipmentItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfEquipmentInDatabasePostEdit).toBe(numberOfEquipmentInDatabasePreEdit);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.name).toBe(result.value?.name);
        expect(itemFromDatabase.description).toBe(result.value?.description);
        expect(itemFromDatabase.cost).toBe(result.value?.cost);
    });

    it("should add a valid equipment item with a non-zero ID that doesn't exist in the database to the database with an incremented ID and the source set to custom", async () => {
        // Arrange
        const nonExistantId = largestEquipmentId + 10;
        const equipmentItemFormFields = getValidCustomEquipmentItemFormFields();
        const numberOfEquipmentInDatabasePreEdit = unitOfWork.repo(EquipmentItem).list().length;

        request.formFields = equipmentItemFormFields;
        request.id = nonExistantId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfEquipmentInDatabasePostEdit = unitOfWork.repo(EquipmentItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(EquipmentItem).first((item) => item.id == result.value?.id) ?? new EquipmentItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfEquipmentInDatabasePostEdit).toBe(numberOfEquipmentInDatabasePreEdit + 1);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.id).not.toBe(nonExistantId);
        expect(itemFromDatabase.name).toBe(result.value?.name);
        expect(itemFromDatabase.description).toBe(result.value?.description);
        expect(itemFromDatabase.cost).toBe(result.value?.cost);
    });

    it("should save an edited equipment item with valid changes to the database when the name wasn't changed", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();
        const numberOfEquipmentInDatabasePreEdit = unitOfWork.repo(EquipmentItem).list().length;

        equipmentItemFormFields.name = "Test Equipment to Edit";

        request.formFields = equipmentItemFormFields;
        request.id = equipmentItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfEquipmentInDatabasePostEdit = unitOfWork.repo(EquipmentItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(EquipmentItem).first((item) => item.id == result.value?.id) ?? new EquipmentItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfEquipmentInDatabasePostEdit).toBe(numberOfEquipmentInDatabasePreEdit);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.name).toBe(result.value?.name);
        expect(itemFromDatabase.description).toBe(result.value?.description);
        expect(itemFromDatabase.cost).toBe(result.value?.cost);
    });

    function getValidCustomEquipmentItemFormFields(): EquipmentItemFormFieldsDto {
        return new EquipmentItemFormFieldsDto("Test Custom Item", "A custom item created for unit testing.", "1000");
    }

    function getValidEditedEquipmentItemFormFields(): EquipmentItemFormFieldsDto {
        return new EquipmentItemFormFieldsDto("Edited Test Equipment to Edit", "Edit me! Edited.", "1750");
    }

    async function addBaseCustomEquipmentItemToDatabase(): Promise<number> {
        const equipmentItem = new EquipmentItem(0, 0, "Test Equipment to Edit", "Edit me!", 1000);

        equipmentItem.saveToDatabase(unitOfWork);

        await unitOfWork.saveChanges();

        return equipmentItem.id;
    }
});
