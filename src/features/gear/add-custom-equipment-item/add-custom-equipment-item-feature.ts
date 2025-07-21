import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { EquipmentItem } from "../equipment-item";
import { EquipmentItemMap } from "../equipment-item-map";
import { AddCustomEquipmentItemRequest } from "./add-custom-equipment-item-request";

export class AddCustomEquipmentItemFeature
    implements IAsyncFeature<AddCustomEquipmentItemRequest, Result<EquipmentItem>>
{
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public async handleAsync(request: AddCustomEquipmentItemRequest): Promise<Result<EquipmentItem>> {
        const equipmentItem = EquipmentItemMap.fromFormFields(request.formFields);
        const validationResults: string[] = equipmentItem.validate();
        const message = LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed);

        return Result.failure(new ResultError(ErrorCode.CreateError, message, validationResults));
    }
}
