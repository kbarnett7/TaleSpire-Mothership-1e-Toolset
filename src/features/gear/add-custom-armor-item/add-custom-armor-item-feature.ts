import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { ArmorItem } from "../armor-item";
import { ArmorItemMap } from "../armor-item-map";
import { EquipmentItem } from "../equipment-item";
import { AddCustomArmorItemRequest } from "./add-custom-armor-item-request";

export class AddCustomArmorItemFeature implements IAsyncFeature<AddCustomArmorItemRequest, Result<ArmorItem>> {
    private readonly unitOfWork: IUnitOfWork;
    private readonly baseFailureMessage: string;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
        this.baseFailureMessage = LocalizationService.instance.translate(MessageKeys.createCustomArmorItemFailed);
    }

    public async handleAsync(request: AddCustomArmorItemRequest): Promise<Result<ArmorItem>> {
        try {
            const armorItem = ArmorItemMap.fromFormFields(request.formFields);
            const validationResults: string[] = armorItem.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(
                    new ResultError(ErrorCode.CreateError, this.baseFailureMessage, validationResults)
                );
            }

            // armorItem.addToDatabase(this.unitOfWork);
            // await this.unitOfWork.saveChanges();
            return Result.success(armorItem);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while creating a new armor item`, ex);

            return this.createExceptionResult(ex);
        }
    }

    private createExceptionResult(ex: Error): Result<ArmorItem> {
        return Result.failure(new ResultError(ErrorCode.CreateError, this.baseFailureMessage, [ex.message]));
    }
}
