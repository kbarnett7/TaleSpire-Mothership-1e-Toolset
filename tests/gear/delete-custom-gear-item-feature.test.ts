import { DeleteCustomGearItemRequest } from "../../src/features/gear/delete-custom-gear-item/delete-custom-gear-item-request";
import { DeleteCustomGearItemFeature } from "../../src/features/gear/delete-custom-gear-item/delete-custom-gear-item-feature";
import { EquipmentItem } from "../../src/features/gear/equipment-item";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { AssertUtils } from "../helpers/assert-utils";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { LocalizationService } from "../../src/lib/localization/localization-service";
import { MessageKeys } from "../../src/lib/localization/message-keys";
import { ArmorItem } from "../../src/features/gear/armor-item";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { IRepository } from "../../src/lib/common/data-access/repository-interface";
import { GearListItem } from "../../src/features/gear/gear-list-item";
import { GetAllGearFeature } from "../../src/features/gear/get-all-gear/get-all-gear-feature";
import { EmptyRequest } from "../../src/lib/common/features/empty-request";

describe("DeleteCustomGearItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: DeleteCustomGearItemRequest;
    let feature: DeleteCustomGearItemFeature;
    let largestArmorItemId: number;
    let largestEquipmentItemId: number;
    let largestWeaponItemId: number;
    let originalNumberOfEquipmentItemsInDatabase: number;
    let originalNumberOfArmorItemsInDatabase: number;
    let originalNumberOfWeaponItemsInDatabase: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestArmorItemId = getLargestGearItemIdInDatabase(unitOfWork.repo(ArmorItem));
        largestEquipmentItemId = getLargestGearItemIdInDatabase(unitOfWork.repo(EquipmentItem));
        largestWeaponItemId = getLargestGearItemIdInDatabase(unitOfWork.repo(WeaponItem));

        setOriginalNumberOfGearItemsIdInDatabase();

        request = new DeleteCustomGearItemRequest();
        feature = new DeleteCustomGearItemFeature(unitOfWork);
    });

    afterEach(async () => {
        resetGearItemListInDatabase(unitOfWork.repo(ArmorItem), largestArmorItemId);
        resetGearItemListInDatabase(unitOfWork.repo(EquipmentItem), largestEquipmentItemId);
        resetGearItemListInDatabase(unitOfWork.repo(WeaponItem), largestWeaponItemId);

        await unitOfWork.saveChanges();
    });

    it.each([EquipmentItem.gearCategory, ArmorItem.gearCategory, WeaponItem.gearCategory])(
        "should fail if the %s item is not a custom item",
        async (category: string) => {
            // Arrange
            request.id = 1;
            request.category = category;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            const msg = LocalizationService.instance
                .translate(MessageKeys.deleteCustomGearItemFailed)
                .replace("{category}", category);

            AssertUtils.expectResultToBeFailure(result, ErrorCode.DeleteError, msg);
            expect(result.error.details.length).toBe(1);
            expect(result.error.details[0]).toContain("not");
            expect(result.error.details[0]).toContain("custom");
            assertNoGearDeletedFromDatabase();
        }
    );

    it.each([EquipmentItem.gearCategory, ArmorItem.gearCategory, WeaponItem.gearCategory])(
        "should succeed if the %s item does not exist",
        async (category: string) => {
            // Arrange
            request.id = -1;
            request.category = category;

            // Act
            const result = await feature.handleAsync(request);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.value).toBeDefined();
            expect(result.value).toBe(-1);
            assertNoGearDeletedFromDatabase();
        }
    );

    it("should succeed for a custom equipment item that exists", async () => {
        // Arrange
        const equipmentItemId = largestEquipmentItemId + 1;
        const equipmentItem = new EquipmentItem(0, 0, "Test Equipment to Delete", "Delete me!", 1000);
        equipmentItem.addToDatabase(unitOfWork);
        await unitOfWork.saveChanges();
        request.id = equipmentItemId;
        request.category = EquipmentItem.gearCategory;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countEquipmentInDatabase = unitOfWork.repo(EquipmentItem).list().length;
        const deletedItem = unitOfWork.repo(EquipmentItem).first((item) => item.id === request.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value).toBe(equipmentItemId);
        expect(countEquipmentInDatabase).toBe(originalNumberOfEquipmentItemsInDatabase);
        expect(deletedItem).toBeUndefined();
    });

    it("should succeed for a custom armor item that exists", async () => {
        // Arrange
        const armorItemId = largestArmorItemId + 1;
        const armorItem = new ArmorItem(0, 0, "Test Armor to Delete", "Delete me!", 1000);
        armorItem.addToDatabase(unitOfWork);
        await unitOfWork.saveChanges();
        request.id = armorItemId;
        request.category = ArmorItem.gearCategory;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countArmorInDatabase = unitOfWork.repo(ArmorItem).list().length;
        const deletedItem = unitOfWork.repo(ArmorItem).first((item) => item.id === request.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value).toBe(armorItemId);
        expect(countArmorInDatabase).toBe(originalNumberOfArmorItemsInDatabase);
        expect(deletedItem).toBeUndefined();
    });

    it("should succeed for a custom weapon item that exists", async () => {
        // Arrange
        const weaponItemId = largestWeaponItemId + 1;
        const weaponItem = new WeaponItem(0, 0, "Test Weapon to Delete", "Delete me!", 1000);
        weaponItem.addToDatabase(unitOfWork);
        await unitOfWork.saveChanges();
        request.id = weaponItemId;
        request.category = WeaponItem.gearCategory;

        // Act
        const result = await feature.handleAsync(request);

        // Assert
        const countWeaponInDatabase = unitOfWork.repo(WeaponItem).list().length;
        const deletedItem = unitOfWork.repo(WeaponItem).first((item) => item.id === request.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value).toBe(weaponItemId);
        expect(countWeaponInDatabase).toBe(originalNumberOfWeaponItemsInDatabase);
        expect(deletedItem).toBeUndefined();
    });

    function assertNoGearDeletedFromDatabase() {
        assertNoArmorDeletedFromDatabase();
        assertNoEquipmentDeletedFromDatabase();
        assertNoWeaponsDeletedFromDatabase();
    }

    function assertNoEquipmentDeletedFromDatabase() {
        const countEquipmentInDatabase = unitOfWork.repo(EquipmentItem).list().length;

        expect(countEquipmentInDatabase).toBe(originalNumberOfEquipmentItemsInDatabase);
    }

    function assertNoArmorDeletedFromDatabase() {
        const countArmorInDatabase = unitOfWork.repo(ArmorItem).list().length;

        expect(countArmorInDatabase).toBe(originalNumberOfArmorItemsInDatabase);
    }

    function assertNoWeaponsDeletedFromDatabase() {
        const countWeaponInDatabase = unitOfWork.repo(WeaponItem).list().length;

        expect(countWeaponInDatabase).toBe(originalNumberOfWeaponItemsInDatabase);
    }

    function getLargestGearItemIdInDatabase(repository: IRepository<any>): number {
        const sortedItems = repository.list().sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    function resetGearItemListInDatabase(repository: IRepository<any>, largestId: number) {
        const gear = repository.list();

        for (let item of gear) {
            if (item.id > largestId) {
                repository.remove(item);
            }
        }
    }

    function setOriginalNumberOfGearItemsIdInDatabase(): void {
        const feature = new GetAllGearFeature(unitOfWork);
        const gear: GearListItem[] = feature.handle(new EmptyRequest());

        originalNumberOfEquipmentItemsInDatabase = gear.filter(
            (item) => item.category === EquipmentItem.gearCategory
        ).length;

        originalNumberOfArmorItemsInDatabase = gear.filter((item) => item.category === ArmorItem.gearCategory).length;

        originalNumberOfWeaponItemsInDatabase = gear.filter((item) => item.category === WeaponItem.gearCategory).length;
    }
});
