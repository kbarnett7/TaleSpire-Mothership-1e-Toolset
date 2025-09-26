import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { SaveDbEntityFeature } from "../../../lib/common/features/save-db-entity-feature";
import { ErrorCode } from "../../../lib/errors/error-code";
import { LocalizationService } from "../../../lib/localization/localization-service";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { Npc } from "../npc";
import { SaveCustomNpcRequest } from "./save-custom-npc-request";

export class SaveCustomNpcFeature
    extends SaveDbEntityFeature
    implements IAsyncFeature<SaveCustomNpcRequest, Result<Npc>>
{
    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
    }

    public async handleAsync(request: SaveCustomNpcRequest): Promise<Result<Npc>> {
        // const validationResults: string[] = request.npc.validate();
        // const message = LocalizationService.instance.translate(MessageKeys.createCustomNpcFailed);

        // return Result.failure(new ResultError(ErrorCode.CreateError, message, validationResults));

        try {
            this.setErrorResultFields(request.id, MessageKeys.createCustomNpcFailed, MessageKeys.editCustomNpcFailed);
            const formField = request.formFields;

            return Result.success(new Npc());
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while creating a new NPC`, ex);

            return this.createExceptionResult<Npc>(ex);
        }
    }
}
