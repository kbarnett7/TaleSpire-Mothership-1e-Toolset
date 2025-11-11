import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { Npc } from "../npc";
import { DeleteCustomNpcRequest } from "./delete-custom-npc-request";

export class DeleteCustomNpcFeature implements IAsyncFeature<DeleteCustomNpcRequest, Result<number>> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public async handleAsync(request: DeleteCustomNpcRequest): Promise<Result<number>> {
        const npc = this.unitOfWork.repo(Npc).first((npc) => npc.id === request.id) ?? new Npc();

        if (npc.id === 0) {
            return Result.success(request.id);
        }

        if (npc.canBeDeleted(this.unitOfWork) === false) {
            return Result.failure(
                new ResultError(
                    ErrorCode.DeleteError,
                    LocalizationService.instance.translate(MessageKeys.deleteCustomNpcFailed),
                    [`"${npc.name}" is not a custom NPC.`]
                )
            );
        }

        npc.deleteFromDatabase(this.unitOfWork);

        await this.unitOfWork.saveChanges();

        return Result.success(request.id);
    }
}
