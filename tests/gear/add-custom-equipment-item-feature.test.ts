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
    const fiftyCharacterLongName: string = "Lorem ipsum dolor sit amet consectetur adipiscingel";

    let request: AddCustomEquipmentItemRequest;
    let feature: AddCustomEquipmentItemFeature;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        const unitOfWork = new UnitOfWork(dbContext);

        request = new AddCustomEquipmentItemRequest();
        feature = new AddCustomEquipmentItemFeature(unitOfWork);
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

    it("should fail if the name is greater than 50 characters long", async () => {
        // Arrange
        const equipmentItemFormFields: EquipmentItemFormFields = getValidCustomEquipmentItemFormFields();
        equipmentItemFormFields.name = fiftyCharacterLongName;
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
        expect(result.error.details[0]).toContain("50");
    });

    function getValidCustomEquipmentItemFormFields(): EquipmentItemFormFields {
        return new EquipmentItemFormFields("Test Custom Item", "A custom item created for unit testing.", "1000");
    }
});
