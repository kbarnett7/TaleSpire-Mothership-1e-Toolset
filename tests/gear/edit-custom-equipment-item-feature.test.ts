import { EditCustomEquipmentItemRequest } from "../../src/features/gear/edit-custom-equipment-item/edit-custom-equipment-item-request";
import { EditCustomEquipmentItemFeature } from "../../src/features/gear/edit-custom-equipment-item/edit-custom-equipment-item-feature";
import { EquipmentItemFormFieldsDto } from "../../src/features/gear/equipment-item-form-fields-dto";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { IRepository } from "../../src/lib/common/data-access/repository-interface";
import { GearTestUtils } from "./gear-test-utils";
import { ValueUtils } from "../helpers/value-utils";

describe("EditCustomEquipmentItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: EditCustomEquipmentItemRequest;
    let feature: EditCustomEquipmentItemFeature;
    let largestEquipmentItemId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestEquipmentItemId = GearTestUtils.getLargestGearItemIdInDatabase(unitOfWork.repo(EquipmentItem));

        request = new EditCustomEquipmentItemRequest();
        feature = new EditCustomEquipmentItemFeature(unitOfWork);
    });

    afterEach(async () => {
        GearTestUtils.resetGearItemListInDatabase(unitOfWork.repo(EquipmentItem), largestEquipmentItemId);

        await unitOfWork.saveChanges();
    });

    it("should fail if there is an unexpected exception", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();

        request.formFields = equipmentItemFormFields;
        request.itemId = equipmentItemId;

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

    it.each([[""], [" "]])("should fail if the name is empty or whitespace", async (name: string) => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();

        equipmentItemFormFields.name = name;

        request.formFields = equipmentItemFormFields;
        request.itemId = equipmentItemId;

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
        expect(result.error.details[0]).toContain("empty");
    });

    it("should fail if the name is greater than 100 characters long", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();

        equipmentItemFormFields.name = ValueUtils.getStringOfRandomCharacters(101);

        request.formFields = equipmentItemFormFields;
        request.itemId = equipmentItemId;

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
        expect(result.error.details[0]).toContain("100");
    });

    it("should fail if there already exists an equipment item with the same name already in the database", async () => {
        // Arrange
        const equipmentItemId = await addBaseCustomEquipmentItemToDatabase();
        const equipmentItemFormFields = getValidEditedEquipmentItemFormFields();

        equipmentItemFormFields.name = "Binoculars";

        request.formFields = equipmentItemFormFields;
        request.itemId = equipmentItemId;

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

    async function addBaseCustomEquipmentItemToDatabase(): Promise<number> {
        const equipmentItem = new EquipmentItem(0, 0, "Test Equipment to Edit", "Edit me!", 1000);

        equipmentItem.addToDatabase(unitOfWork);

        await unitOfWork.saveChanges();

        return equipmentItem.id;
    }

    function getValidEditedEquipmentItemFormFields(): EquipmentItemFormFieldsDto {
        return new EquipmentItemFormFieldsDto("Edited Test Equipment to Edit", "Edit me! Edited.", "1750");
    }
});
