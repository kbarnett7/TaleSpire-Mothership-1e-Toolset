import { AddCustomArmorItemRequest } from "../../src/features/gear/add-custom-armor-item/add-custom-armor-item-request";
import { AddCustomArmorItemFeature } from "../../src/features/gear/add-custom-armor-item/add-custom-armor-item-feature";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";
import { ArmorItemFormFieldsDto } from "../../src/features/gear/armor-item-form-fields-dto";
import { ValueUtils } from "../helpers/value-utils";

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
        // Arrange
        const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
        armorItemFormFields.description = ValueUtils.getStringOfRandomCharacters(1001);
        request.formFields = armorItemFormFields;
        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomArmorItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    it("should fail if the name is greater than 100 characters long", async () => {
        // Arrange
        const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
        armorItemFormFields.name = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = armorItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomArmorItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("100");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if armor points is negative or contains non-digit characters",
        async (armorPoints: string) => {
            // Arrange
            const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
            armorItemFormFields.armorPoints = armorPoints;
            request.formFields = armorItemFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomArmorItemFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("armor points");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    function getValidCustomArmorItemFormFields(): ArmorItemFormFieldsDto {
        return new ArmorItemFormFieldsDto("Test Custom Item", "A custom item created for unit testing.", "1000", "2");
    }

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
