import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { EquipmentItem } from "../equipment-item";
import { EquipmentItemMap } from "../equipment-item-map";
import { EditCustomEquipmentItemRequest } from "./edit-custom-equipment-item-request";

export class EditCustomEquipmentItemFeature
    implements IAsyncFeature<EditCustomEquipmentItemRequest, Result<EquipmentItem>>
{
    private readonly unitOfWork: IUnitOfWork;
    private readonly baseFailureMessage: string;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
        this.baseFailureMessage = LocalizationService.instance.translate(MessageKeys.editCustomEquipmentItemFailed);
    }

    public async handleAsync(request: EditCustomEquipmentItemRequest): Promise<Result<EquipmentItem>> {
        try {
            const equipmentItem = EquipmentItemMap.fromFormFields(request.formFields);
            const validationResults: string[] = equipmentItem.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(
                    new ResultError(ErrorCode.CreateError, this.baseFailureMessage, validationResults)
                );
            }

            //equipmentItem.addToDatabase(this.unitOfWork);

            //await this.unitOfWork.saveChanges();

            return Result.success(equipmentItem);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while editing an existing equipment item`, ex);

            return this.createExceptionResult(ex);
        }
    }

    private createExceptionResult(ex: Error): Result<EquipmentItem> {
        return Result.failure(new ResultError(ErrorCode.EditError, this.baseFailureMessage, [ex.message]));
    }
}
