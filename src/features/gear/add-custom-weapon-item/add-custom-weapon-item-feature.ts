import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { WeaponItem } from "../weapon-item";
import { WeaponItemMap } from "../weapon-item-map";
import { AddCustomWeaponItemRequest } from "./add-custom-weapon-item-request";

export class AddCustomWeaponItemFeature implements IAsyncFeature<AddCustomWeaponItemRequest, Result<WeaponItem>> {
    private readonly unitOfWork: IUnitOfWork;
    private readonly baseFailureMessage: string;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
        this.baseFailureMessage = LocalizationService.instance.translate(MessageKeys.createCustomWeaponItemFailed);
    }

    public async handleAsync(request: AddCustomWeaponItemRequest): Promise<Result<WeaponItem>> {
        try {
            const weaponItem = WeaponItemMap.fromFormFields(request.formFields);
            const validationResults: string[] = weaponItem.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(
                    new ResultError(ErrorCode.CreateError, this.baseFailureMessage, validationResults)
                );
            }

            weaponItem.saveToDatabase(this.unitOfWork);

            await this.unitOfWork.saveChanges();

            return Result.success(weaponItem);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while creating a new weapon item`, ex);

            return this.createExceptionResult(ex);
        }
    }

    private createExceptionResult(ex: Error): Result<WeaponItem> {
        return Result.failure(new ResultError(ErrorCode.CreateError, this.baseFailureMessage, [ex.message]));
    }
}
