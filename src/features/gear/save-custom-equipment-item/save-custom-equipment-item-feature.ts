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
import { SaveCustomEquipmentItemRequest } from "./save-custom-equipment-item-request";

export class SaveCustomEquipmentItemFeature
    implements IAsyncFeature<SaveCustomEquipmentItemRequest, Result<EquipmentItem>>
{
    private readonly unitOfWork: IUnitOfWork;
    private baseFailureMessage: string;
    private errorCode: string;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
        this.baseFailureMessage = LocalizationService.instance.translate(MessageKeys.saveCustomEquipmentItemFailed);
        this.errorCode = ErrorCode.UnexpectedError;
    }

    public async handleAsync(request: SaveCustomEquipmentItemRequest): Promise<Result<EquipmentItem>> {
        try {
            this.setErrorResultFields(request);

            const equipmentItem = EquipmentItemMap.fromFormFields(request.formFields);
            equipmentItem.id = request.itemId;

            const validationResults: string[] = equipmentItem.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(new ResultError(this.errorCode, this.baseFailureMessage, validationResults));
            }

            equipmentItem.saveToDatabase(this.unitOfWork);

            await this.unitOfWork.saveChanges();

            return Result.success(equipmentItem);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while creating a new equipment item`, ex);

            return this.createExceptionResult(ex);
        }
    }

    private setErrorResultFields(request: SaveCustomEquipmentItemRequest) {
        if (request.itemId === 0) {
            this.errorCode = ErrorCode.CreateError;
            this.baseFailureMessage = LocalizationService.instance.translate(
                MessageKeys.createCustomEquipmentItemFailed
            );
        } else {
            this.errorCode = ErrorCode.EditError;
            this.baseFailureMessage = LocalizationService.instance.translate(MessageKeys.editCustomEquipmentItemFailed);
        }
    }

    private createExceptionResult(ex: Error): Result<EquipmentItem> {
        return Result.failure(new ResultError(this.errorCode, this.baseFailureMessage, [ex.message]));
    }
}
