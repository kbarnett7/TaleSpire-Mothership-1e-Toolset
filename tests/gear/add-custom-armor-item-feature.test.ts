import { AddCustomArmorItemRequest } from "../../src/features/gear/add-custom-armor-item/add-custom-armor-item-request";
import { AddCustomArmorItemFeature } from "../../src/features/gear/add-custom-armor-item/add-custom-armor-item-feature";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";

describe("AddCustomEquipmentItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: AddCustomArmorItemRequest;
    let feature: AddCustomArmorItemFeature;
    let largestArmorItemId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestArmorItemId = getLargestArmorItemIdInDatabase();

        request = new AddCustomArmorItemRequest();
        feature = new AddCustomArmorItemFeature(unitOfWork);
    });

    afterEach(async () => {
        resetArmorListInDatabase();
    });

    it("should fail if there is an unexpected exception", async () => {
        // // Arrange
        // const equipmentItemFormFields: EquipmentItemFormFieldsDto = getValidCustomEquipmentItemFormFields();
        // equipmentItemFormFields.description = getStringOfRandomCharacters(1001);
        // request.formFields = equipmentItemFormFields;
        // jest.spyOn(request, "formFields", "get").mockImplementation(() => {
        //     throw new Error("Mocked exception");
        // });
        // // Act
        // const result = await feature.handleAsync(request);
        // // Assert
        // AssertUtils.expectResultToBeFailure(
        //     result,
        //     ErrorCode.CreateError,
        //     LocalizationService.instance.translate(MessageKeys.createCustomEquipmentItemFailed)
        // );
        // expect(result.error.details.length).toBe(1);
        // expect(result.error.details[0]).toContain("Mocked");
    });

    function getLargestArmorItemIdInDatabase(): number {
        const sortedItems = unitOfWork
            .repo(ArmorItem)
            .list()
            .sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    function resetArmorListInDatabase() {
        const equipment = unitOfWork.repo(ArmorItem).list();

        for (let item of equipment) {
            if (item.id > largestArmorItemId) {
                unitOfWork.repo(ArmorItem).remove(item);
            }
        }
    }
});
