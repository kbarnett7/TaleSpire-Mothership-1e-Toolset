import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { SaveDbEntityFeature } from "../../../lib/common/features/save-db-entity-feature";
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
    extends SaveDbEntityFeature
    implements IAsyncFeature<SaveCustomEquipmentItemRequest, Result<EquipmentItem>>
{
    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
    }

    public async handleAsync(request: SaveCustomEquipmentItemRequest): Promise<Result<EquipmentItem>> {
        try {
            this.setErrorResultFields(
                request.id,
                MessageKeys.createCustomEquipmentItemFailed,
                MessageKeys.editCustomEquipmentItemFailed
            );

            const equipmentItem = EquipmentItemMap.fromFormFields(request.formFields);
            equipmentItem.id = request.id;

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

            return this.createExceptionResult<EquipmentItem>(ex);
        }
    }
}
