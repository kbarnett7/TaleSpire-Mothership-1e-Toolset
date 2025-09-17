import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { SaveDbEntityFeature } from "../../../lib/common/features/save-db-entity-feature";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { WeaponItem } from "../weapon-item";
import { WeaponItemMap } from "../weapon-item-map";
import { SaveCustomWeaponItemRequest } from "./save-custom-weapon-item-request";

export class SaveCustomWeaponItemFeature
    extends SaveDbEntityFeature
    implements IAsyncFeature<SaveCustomWeaponItemRequest, Result<WeaponItem>>
{
    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
    }

    public async handleAsync(request: SaveCustomWeaponItemRequest): Promise<Result<WeaponItem>> {
        try {
            this.setErrorResultFields(
                request.id,
                MessageKeys.createCustomWeaponItemFailed,
                MessageKeys.editCustomWeaponItemFailed
            );

            const weaponItem = WeaponItemMap.fromFormFields(request.formFields);
            weaponItem.id = request.id;

            const validationResults: string[] = weaponItem.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(new ResultError(this.errorCode, this.baseFailureMessage, validationResults));
            }

            weaponItem.saveToDatabase(this.unitOfWork);

            await this.unitOfWork.saveChanges();

            return Result.success(weaponItem);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while creating a new weapon item`, ex);

            return this.createExceptionResult<WeaponItem>(ex);
        }
    }
}
