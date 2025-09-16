import { SaveCustomArmorItemRequest } from "../../src/features/gear/save-custom-armor-item/save-custom-armor-item-request";
import { SaveCustomArmorItemFeature } from "../../src/features/gear/save-custom-armor-item/save-custom-armor-item-feature";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";
import { ArmorItemFormFieldsDto } from "../../src/features/gear/armor-item-form-fields-dto";
import { ValueUtils } from "../helpers/value-utils";
import { ArmorSpeed } from "../../src/features/gear/armor-speed";
import { GearTestUtils } from "./gear-test-utils";

describe("SaveCustomArmorItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: SaveCustomArmorItemRequest;
    let feature: SaveCustomArmorItemFeature;
    let largestArmorItemId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestArmorItemId = GearTestUtils.getLargestGearItemIdInDatabase(unitOfWork.repo(ArmorItem));

        request = new SaveCustomArmorItemRequest();
        feature = new SaveCustomArmorItemFeature(unitOfWork);
    });

    afterEach(async () => {
        GearTestUtils.resetGearItemListInDatabase(unitOfWork.repo(ArmorItem), largestArmorItemId);
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

    it.each([["-1"], ["123abc"]])(
        "should fail if oxygen is negative or contains non-digit characters",
        async (oxygen: string) => {
            // Arrange
            const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
            armorItemFormFields.oxygen = oxygen;
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
            expect(result.error.details[0]).toContain("oxygen");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail if the speed is an invalid option", async () => {
        // Arrange
        const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
        armorItemFormFields.speed = "invalid";
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
        expect(result.error.details[0]).toContain("speed");
        expect(result.error.details[0]).toContain(ArmorSpeed.Normal);
        expect(result.error.details[0]).toContain(ArmorSpeed.Advantage);
        expect(result.error.details[0]).toContain(ArmorSpeed.Disadvantage);
    });

    it("should fail if special is greater than 1000 characters long", async () => {
        // Arrange
        const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
        armorItemFormFields.special = ValueUtils.getStringOfRandomCharacters(1001);
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
        expect(result.error.details[0]).toContain("special");
        expect(result.error.details[0]).toContain("1,000");
    });

    it("should fail if there already exists an armor item with the same name already in the database", async () => {
        // Arrange
        const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
        armorItemFormFields.name = "Vaccsuit";
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
        expect(result.error.details[0]).toContain("Vaccsuit");
        expect(result.error.details[0]).toContain("already exists");
    });

    it("should add a valid armor item to the database with an incremented ID and the source set to custom", async () => {
        // Arrange
        const numberOfArmorInDatabasePreAdd = unitOfWork.repo(ArmorItem).list().length;
        const armorItemFormFields: ArmorItemFormFieldsDto = getValidCustomArmorItemFormFields();
        request.formFields = armorItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfArmorInDatabasePostAdd = unitOfWork.repo(ArmorItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(ArmorItem).first((item) => item.id == result.value?.id) ?? new ArmorItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfArmorInDatabasePostAdd).toBe(numberOfArmorInDatabasePreAdd + 1);
        expect(itemFromDatabase.id).toBe(largestArmorItemId + 1);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.name).toBe(result.value?.name);
        expect(itemFromDatabase.description).toBe(result.value?.description);
        expect(itemFromDatabase.cost).toBe(result.value?.cost);
        expect(itemFromDatabase.armorPoints).toBe(result.value?.armorPoints);
        expect(itemFromDatabase.oxygen).toBe(result.value?.oxygen);
        expect(itemFromDatabase.speed).toBe(result.value?.speed);
        expect(itemFromDatabase.special).toBe(result.value?.special);
    });

    function getValidCustomArmorItemFormFields(): ArmorItemFormFieldsDto {
        return new ArmorItemFormFieldsDto(
            "Test Custom Item",
            "A custom item created for unit testing.",
            "1000",
            "2",
            "6",
            ArmorSpeed.Advantage,
            "Pass the unit test!"
        );
    }
});
