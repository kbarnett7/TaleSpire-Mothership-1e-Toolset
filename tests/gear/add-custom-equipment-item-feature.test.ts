import { AddCustomEquipmentItemRequest } from "../../src/features/gear/add-custom-equipment-item/add-custom-equipment-item-request";
import { AddCustomEquipmentItemFeature } from "../../src/features/gear/add-custom-equipment-item/add-custom-equipment-item-feature";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { EquipmentItemFormFieldsDto } from "../../src/features/gear/equipment-item-form-fields-dto";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { AssertUtils } from "../helpers/assert-utils";
import { EquipmentItem } from "../../src/features/gear/equipment-item";

describe("AddCustomEquipmentItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: AddCustomEquipmentItemRequest;
    let feature: AddCustomEquipmentItemFeature;
    let largestEquipmentId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestEquipmentId = getLargestEquipmentItemIdInDatabase();

        request = new AddCustomEquipmentItemRequest();
        feature = new AddCustomEquipmentItemFeature(unitOfWork);
    });

    afterEach(async () => {
        resetEquipmentListInDatabase();
    });

    it("should fail if there is an unexpected exception", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.description = getStringOfRandomCharacters(1001);
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
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
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
            LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("empty");
    });

    it("should fail if the name is greater than 100 characters long", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.name = getStringOfRandomCharacters(101);
        request.formFields = equipmentItemFormFields;

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

    it("should fail if the description is greater than 1000 characters long", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.description = getStringOfRandomCharacters(1001);
        request.formFields = equipmentItemFormFields;

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
                LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("cost");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

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

    function getValidCustomEquipmentItemFormFields(): EquipmentItemFormFieldsDto {
        return new EquipmentItemFormFieldsDto("Test Custom Item", "A custom item created for unit testing.", "1000");
    }

    function getRandomCharacter(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const index = Math.floor(Math.random() * chars.length);
        return chars.charAt(index);
    }

    function getStringOfRandomCharacters(length: number) {
        let result = "";

        for (let i = 0; i < length; i++) {
            result += getRandomCharacter();
        }

        return result;
    }

    function getLargestEquipmentItemIdInDatabase(): number {
        const sortedItems = unitOfWork
            .repo(EquipmentItem)
            .list()
            .sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    function resetEquipmentListInDatabase() {
        const equipment = unitOfWork.repo(EquipmentItem).list();

        for (let item of equipment) {
            if (item.id > largestEquipmentId) {
                unitOfWork.repo(EquipmentItem).remove(item);
            }
        }
    }
});
