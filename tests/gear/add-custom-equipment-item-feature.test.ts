import { AddCustomEquipmentItemRequest } from "../../src/features/gear/add-custom-equipment-item/add-custom-equipment-item-request";
import { AddCustomEquipmentItemFeature } from "../../src/features/gear/add-custom-equipment-item/add-custom-equipment-item-feature";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { EquipmentItemFormFields } from "../../src/features/gear/equipment-item-form-fields";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { AssertUtils } from "../helpers/assert-utils";

describe("AddCustomEquipmentItemFeature", () => {
    let request: AddCustomEquipmentItemRequest;
    let feature: AddCustomEquipmentItemFeature;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);

        request = new AddCustomEquipmentItemRequest();
        feature = new AddCustomEquipmentItemFeature(unitOfWork);
    });

    it("should fail if there is an unexpected exception", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFields = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.description = getStringOfRandomCharacters(1001);
        request.formFields = equipmentItemFormFields;

        jest.spyOn(request.formFields, "name", "get").mockImplementation(() => {
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
        const equipmentItemFormFields: EquipmentItemFormFields = getValidCustomEquipmentItemFormFields();
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
        const equipmentItemFormFields: EquipmentItemFormFields = getValidCustomEquipmentItemFormFields();
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
        const equipmentItemFormFields: EquipmentItemFormFields = getValidCustomEquipmentItemFormFields();
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
            const equipmentItemFormFields: EquipmentItemFormFields = getValidCustomEquipmentItemFormFields();
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

    function getValidCustomEquipmentItemFormFields(): EquipmentItemFormFields {
        return new EquipmentItemFormFields("Test Custom Item", "A custom item created for unit testing.", "1000");
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
});
