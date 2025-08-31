import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { ArmorItem } from "../armor-item";
import { EquipmentItem } from "../equipment-item";
import { GearItem } from "../gear-item";
import { WeaponItem } from "../weapon-item";
import { DeleteCustomGearItemRequest } from "./delete-custom-gear-item-request";

export class DeleteCustomGearItemFeature implements IAsyncFeature<DeleteCustomGearItemRequest, Result<number>> {
    private readonly unitOfWork: IUnitOfWork;
    private readonly baseFailureMessage: string;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
        this.baseFailureMessage = LocalizationService.instance.translate(MessageKeys.deleteCustomGearItemFailed);
    }

    public async handleAsync(request: DeleteCustomGearItemRequest): Promise<Result<number>> {
        const gearItem = this.getGearItem(request);

        if (gearItem.id === 0) {
            return Result.success(request.id);
        }

        if (gearItem.canBeDelete(this.unitOfWork) === false) {
            const msg = LocalizationService.instance
                .translate(MessageKeys.deleteCustomGearItemFailed)
                .replace("{category}", request.category);

            return Result.failure(new ResultError(ErrorCode.DeleteError, msg, ["The item is not a custom item."]));
        }

        gearItem.deleteFromDatabase(this.unitOfWork);

        await this.unitOfWork.saveChanges();

        return Result.success(request.id);
    }

    private getGearItem(request: DeleteCustomGearItemRequest): GearItem {
        if (request.category === ArmorItem.gearCategory) {
            return this.unitOfWork.repo(ArmorItem).first((item) => item.id === request.id) ?? new ArmorItem();
        } else if (request.category === WeaponItem.gearCategory) {
            return this.unitOfWork.repo(WeaponItem).first((item) => item.id === request.id) ?? new WeaponItem();
        } else {
            return this.unitOfWork.repo(EquipmentItem).first((item) => item.id === request.id) ?? new EquipmentItem();
        }
    }
}
