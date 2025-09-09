import { EditCustomEquipmentItemRequest } from "../../src/features/gear/edit-custom-equipment-item/edit-custom-equipment-item-request";
import { EditCustomEquipmentItemFeature } from "../../src/features/gear/edit-custom-equipment-item/edit-custom-equipment-item-feature";
import { EquipmentItemFormFieldsDto } from "../../src/features/gear/equipment-item-form-fields-dto";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";

describe("EditCustomEquipmentItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: EditCustomEquipmentItemRequest;
    let feature: EditCustomEquipmentItemFeature;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        request = new EditCustomEquipmentItemRequest();
        feature = new EditCustomEquipmentItemFeature(unitOfWork);
    });

    afterEach(async () => {});

    it("should fail if there is an unexpected exception", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        request.formFields = equipmentItemFormFields;

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

    function getValidCustomEquipmentItemFormFields(): EquipmentItemFormFieldsDto {
        return new EquipmentItemFormFieldsDto("Test Custom Item", "A custom item created for unit testing.", "1000");
    }
});
