import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { Npc } from "../npc";
import { CreateCustomNpcRequest } from "./create-custom-npc-request";

export class CreateCustomNpcFeature implements IFeature<CreateCustomNpcRequest, Result<Npc>> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: CreateCustomNpcRequest): Result<Npc> {
        const validationResults: string[] = request.npc.validate();
        const message = LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed);

        return Result.failure(new ResultError(ErrorCode.CreateError, message, validationResults));
    }
}
