import { SaveCustomWeaponItemRequest } from "../../src/features/gear/save-custom-weapon-item/save-custom-weapon-item-request";
import { SaveCustomWeaponItemFeature } from "../../src/features/gear/save-custom-weapon-item/save-custom-weapon-item-feature";
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
import { SourcesService } from "../../src/features/sources/sources-service";

describe("SaveCustomWeaponItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: SaveCustomWeaponItemRequest;
    let feature: SaveCustomWeaponItemFeature;
    let largestWeaponItemId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestWeaponItemId = GearTestUtils.getLargestGearItemIdInDatabase(unitOfWork.repo(WeaponItem));

        request = new SaveCustomWeaponItemRequest();
        feature = new SaveCustomWeaponItemFeature(unitOfWork);
    });

    afterEach(async () => {
        GearTestUtils.resetGearItemListInDatabase(unitOfWork.repo(WeaponItem), largestWeaponItemId);

        await unitOfWork.saveChanges();
    });

    it("should fail if there is an unexpected exception when adding a new weapon item", async () => {
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

    it("should fail if there is an unexpected exception when editing an existing weapon item", async () => {
        // Arrange
        const weaponItemId = await addBaseCustomWeaponItemToDatabase();
        const weaponItemFormFields = getValidEditedWeaponItemFormFields();

        request.formFields = weaponItemFormFields;
        request.id = weaponItemId;

        jest.spyOn(request, "formFields", "get").mockImplementation(() => {
            throw new Error("Mocked exception");
        });

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("Mocked");
    });

    it("should have create error code info when adding an weapon item fails", async () => {
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
    });

    it("should have edit error code info when editing an weapon item fails", async () => {
        // Arrange
        const weaponItemId = await addBaseCustomWeaponItemToDatabase();
        const weaponItemFormFields = getValidEditedWeaponItemFormFields();

        weaponItemFormFields.name = ValueUtils.getStringOfRandomCharacters(101);

        request.formFields = weaponItemFormFields;
        request.id = weaponItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editCustomWeaponItemFailed)
        );
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
        expect(itemFromDatabase.sourceId).toBe(SourcesService.instance.getCustomItemSourceId(unitOfWork));
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

    it("should fail when editing an weapon item to have the same name as another weapon item in the database", async () => {
        // Arrange
        const weaponItemId = await addBaseCustomWeaponItemToDatabase();
        const weaponItemFormFields = getValidEditedWeaponItemFormFields();

        weaponItemFormFields.name = "Combat Shotgun";

        request.formFields = weaponItemFormFields;
        request.id = weaponItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        AssertUtils.expectResultToBeFailure(
            result,
            ErrorCode.EditError,
            LocalizationService.instance.translate(MessageKeys.editCustomWeaponItemFailed)
        );
        expect(result.error.details.length).toBe(1);
        expect(result.error.details[0]).toContain("name");
        expect(result.error.details[0]).toContain("Combat Shotgun");
        expect(result.error.details[0]).toContain("already exists");
    });

    it("should save an edited weapon item with valid changes to the database", async () => {
        // Arrange
        const weaponItemId = await addBaseCustomWeaponItemToDatabase();
        const weaponItemFormFields = getValidEditedWeaponItemFormFields();
        const numberOfWeaponInDatabasePreEdit = unitOfWork.repo(WeaponItem).list().length;

        request.formFields = weaponItemFormFields;
        request.id = weaponItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfWeaponsInDatabasePostEdit = unitOfWork.repo(WeaponItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(WeaponItem).first((item) => item.id == result.value?.id) ?? new WeaponItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfWeaponsInDatabasePostEdit).toBe(numberOfWeaponInDatabasePreEdit);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.sourceId).toBe(SourcesService.instance.getCustomItemSourceId(unitOfWork));
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

    it("should add a valid weapon item with a non-zero ID that doesn't exist in the database to the database with an incremented ID and the source set to custom", async () => {
        // Arrange
        const nonExistentId = largestWeaponItemId + 10;
        const weaponItemFormFields = getValidCustomWeaponItemFormFields();
        const numberOfWeaponsInDatabasePreEdit = unitOfWork.repo(WeaponItem).list().length;

        request.formFields = weaponItemFormFields;
        request.id = nonExistentId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfWeaponsInDatabasePostEdit = unitOfWork.repo(WeaponItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(WeaponItem).first((item) => item.id == result.value?.id) ?? new WeaponItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfWeaponsInDatabasePostEdit).toBe(numberOfWeaponsInDatabasePreEdit + 1);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.id).not.toBe(nonExistentId);
        expect(itemFromDatabase.sourceId).toBe(SourcesService.instance.getCustomItemSourceId(unitOfWork));
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

    it("should save an edited weapon item with valid changes to the database when the name wasn't changed", async () => {
        // Arrange
        const weaponItemId = await addBaseCustomWeaponItemToDatabase();
        const weaponItemFormFields = getValidEditedWeaponItemFormFields();
        const numberOfWeaponInDatabasePreEdit = unitOfWork.repo(WeaponItem).list().length;

        weaponItemFormFields.name = "Test Weapon to Edit";

        request.formFields = weaponItemFormFields;
        request.id = weaponItemId;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const numberOfWeaponsInDatabasePostEdit = unitOfWork.repo(WeaponItem).list().length;
        const itemFromDatabase =
            unitOfWork.repo(WeaponItem).first((item) => item.id == result.value?.id) ?? new WeaponItem();

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(numberOfWeaponsInDatabasePostEdit).toBe(numberOfWeaponInDatabasePreEdit);
        expect(itemFromDatabase.id).toBe(result.value?.id);
        expect(itemFromDatabase.sourceId).toBe(SourcesService.instance.getCustomItemSourceId(unitOfWork));
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

    function getValidEditedWeaponItemFormFields(): WeaponItemFormFieldsDto {
        return new WeaponItemFormFieldsDto(
            "Edited Test Custom Item",
            "A custom item created for unit testing. Edit",
            "1500",
            WeaponCategory.IndustrialEquipment,
            WeaponRange.Close,
            "2d10",
            "1",
            "Bleeding",
            "Pass the unit editing test!"
        );
    }

    async function addBaseCustomWeaponItemToDatabase(): Promise<number> {
        const weaponItem = new WeaponItem(
            0,
            0,
            "Test Weapon to Edit",
            "A custom item created for unit testing.",
            1000,
            WeaponCategory.Firearm,
            WeaponRange.Long,
            "1d10",
            3,
            "Gunshot",
            "Pass the unit test!"
        );

        weaponItem.saveToDatabase(unitOfWork);

        await unitOfWork.saveChanges();

        return weaponItem.id;
    }
});
