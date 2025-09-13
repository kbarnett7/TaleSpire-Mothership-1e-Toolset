import { AddCustomWeaponItemRequest } from "../../src/features/gear/add-custom-weapon-item/add-custom-weapon-item-request";
import { AddCustomWeaponItemFeature } from "../../src/features/gear/add-custom-weapon-item/add-custom-weapon-item-feature";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { WeaponItemFormFieldsDto } from "../../src/features/gear/weapon-item-form-fields-dto";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { WeaponCategory } from "../../src/features/gear/weapon-category";
import { WeaponRange } from "../../src/features/gear/weapon-range";
import { ValueUtils } from "../helpers/value-utils";
import { AssertUtils } from "../helpers/assert-utils";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { GearTestUtils } from "./gear-test-utils";

describe("AddCustomWeaponItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: AddCustomWeaponItemRequest;
    let feature: AddCustomWeaponItemFeature;
    let largestWeaponItemId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestWeaponItemId = GearTestUtils.getLargestGearItemIdInDatabase(unitOfWork.repo(WeaponItem));

        request = new AddCustomWeaponItemRequest();
        feature = new AddCustomWeaponItemFeature(unitOfWork);
    });

    afterEach(async () => {
        GearTestUtils.resetGearItemListInDatabase(unitOfWork.repo(WeaponItem), largestWeaponItemId);
    });

    it("should fail if there is an unexpected exception", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.description = ValueUtils.getStringOfRandomCharacters(1001);
        request.formFields = weaponItemFormFields;
        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    it("should fail if the name is greater than 100 characters long", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.name = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("100");
    });

    it("should fail if the weapon category is an invalid option", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.category = "invalid";
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("weapon category");
        expect(result.error.details[0]).toContain(WeaponCategory.Melee);
        expect(result.error.details[0]).toContain(WeaponCategory.Firearm);
        expect(result.error.details[0]).toContain(WeaponCategory.IndustrialEquipment);
    });

    it("should fail if the range is an invalid option", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.range = "invalid";
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("range");
        expect(result.error.details[0]).toContain(WeaponRange.Adjacent);
        expect(result.error.details[0]).toContain(WeaponRange.Close);
        expect(result.error.details[0]).toContain(WeaponRange.Long);
        expect(result.error.details[0]).toContain(WeaponRange.Extreme);
    });

    it("should fail if the damage is greater than 100 characters long", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.damage = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("damage");
        expect(result.error.details[0]).toContain("100");
    });

    it.each([["-1"], ["123abc"]])(
        "should fail if shots is negative or contains non-digit characters",
        async (shots: string) => {
            // Arrange
            const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
            weaponItemFormFields.shots = shots;
            request.formFields = weaponItemFormFields;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            AssertUtils.expectResultToBeFailure(
                result,
                ErrorCode.CreateError,
                LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
            );
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("shots");
            expect(result.error.details[0]).toContain("zero");
            expect(result.error.details[0]).toContain("digit");
        }
    );

    it("should fail if the wound is greater than 100 characters long", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.wound = ValueUtils.getStringOfRandomCharacters(101);
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("wound");
        expect(result.error.details[0]).toContain("100");
    });

    it("should fail if special is greater than 1000 characters long", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.special = ValueUtils.getStringOfRandomCharacters(1001);
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("special");
        expect(result.error.details[0]).toContain("1,000");
    });

    it("should fail if there already exists an weapon item with the same name already in the database", async () => {
        // Arrange
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        weaponItemFormFields.name = "Combat Shotgun";
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.CreateError,
            LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("Combat Shotgun");
        expect(result.error.details[0]).toContain("already exists");
    });

    it("should add a valid weapon item to the database with an incremented ID and the source set to custom", async () => {
        // Arrange
        const numberOfWeaponsInDatabasePreAdd = unitOfWork.repo(WeaponItem).list().length;
        const weaponItemFormFields: WeaponItemFormFieldsDto = getValidCustomWeaponItemFormFields();
        request.formFields = weaponItemFormFields;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfWeaponsInDatabasePostAdd = unitOfWork.repo(WeaponItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(WeaponItem).first((item) => item.id == result.value?.id) ?? new WeaponItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfWeaponsInDatabasePostAdd).toBe(numberOfWeaponsInDatabasePreAdd + 1);
        expect(itemFromDatabase.id).toBe(largestWeaponItemId + 1);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.name).toBe(result.value?.name);
        expect(itemFromDatabase.description).toBe(result.value?.description);
        expect(itemFromDatabase.cost).toBe(result.value?.cost);
        expect(itemFromDatabase.category).toBe(result.value?.category);
        expect(itemFromDatabase.range).toBe(result.value?.range);
        expect(itemFromDatabase.damage).toBe(result.value?.damage);
        expect(itemFromDatabase.shots).toBe(result.value?.shots);
        expect(itemFromDatabase.wound).toBe(result.value?.wound);
        expect(itemFromDatabase.special).toBe(result.value?.special);
    });

    function getValidCustomWeaponItemFormFields(): WeaponItemFormFieldsDto {
        return new WeaponItemFormFieldsDto(
            "Test Custom Item",
            "A custom item created for unit testing.",
            "1000",
            WeaponCategory.Firearm,
            WeaponRange.Long,
            "1d10",
            "3",
            "Gunshot",
            "Pass the unit test!"
        );
    }
});
