import { AddCustomWeaponItemRequest } from "../../src/features/gear/add-custom-weapon-item/add-custom-weapon-item-request";
import { AddCustomWeaponItemFeature } from "../../src/features/gear/add-custom-weapon-item/add-custom-weapon-item-feature";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { WeaponItemFormFieldsDto } from "../../src/features/gear/weapon-item-form-fields-dto";
import { WeaponItem } from "../../src/features/gear/weapon-item";
import { WeaponCategory } from "../../src/features/gear/weapon-category";
import { WeaponRange } from "../../src/features/gear/weapon-range";

describe("AddCustomWeaponItemFeature", () => {
    let unitOfWork: UnitOfWork;
    let request: AddCustomWeaponItemRequest;
    let feature: AddCustomWeaponItemFeature;
    let largestWeaponItemId: number;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        largestWeaponItemId = getLargestWeaponItemIdInDatabase();

        request = new AddCustomWeaponItemRequest();
        feature = new AddCustomWeaponItemFeature(unitOfWork);
    });

    afterEach(async () => {
        resetWeaponListInDatabase();
    });

    function getValidCustomArmorItemFormFields(): WeaponItemFormFieldsDto {
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

    function getLargestWeaponItemIdInDatabase(): number {
        const sortedItems = unitOfWork
            .repo(WeaponItem)
            .list()
            .sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    function resetWeaponListInDatabase() {
        const equipment = unitOfWork.repo(WeaponItem).list();

        for (let item of equipment) {
            if (item.id > largestWeaponItemId) {
                unitOfWork.repo(WeaponItem).remove(item);
            }
        }
    }
});
