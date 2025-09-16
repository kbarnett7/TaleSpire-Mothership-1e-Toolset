import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { SaveDbEntityFeature } from "../../../lib/common/features/save-db-entity-feature";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { ArmorItem } from "../armor-item";
import { ArmorItemMap } from "../armor-item-map";
import { SaveCustomArmorItemRequest } from "./save-custom-armor-item-request";

export class SaveCustomArmorItemFeature
    extends SaveDbEntityFeature
    implements IAsyncFeature<SaveCustomArmorItemRequest, Result<ArmorItem>>
{
    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
    }

    public async handleAsync(request: SaveCustomArmorItemRequest): Promise<Result<ArmorItem>> {
        try {
            this.setErrorResultFields(
                request.id,
                MessageKeys.createCustomArmorItemFailed,
                MessageKeys.editCustomArmorItemFailed
            );

            const armorItem = ArmorItemMap.fromFormFields(request.formFields);
            armorItem.id = request.id;

            const validationResults: string[] = armorItem.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(new ResultError(this.errorCode, this.baseFailureMessage, validationResults));
            }

            armorItem.saveToDatabase(this.unitOfWork);

            await this.unitOfWork.saveChanges();

            return Result.success(armorItem);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while creating a new armor item`, ex);

            return this.createExceptionResult<ArmorItem>(ex);
        }
    }
}
