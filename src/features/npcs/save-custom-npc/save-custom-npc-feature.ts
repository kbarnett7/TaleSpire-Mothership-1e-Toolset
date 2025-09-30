import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { SaveDbEntityFeature } from "../../../lib/common/features/save-db-entity-feature";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { Npc } from "../npc";
import { NpcMap } from "../npc-map";
import { SaveCustomNpcRequest } from "./save-custom-npc-request";

export class SaveCustomNpcFeature
    extends SaveDbEntityFeature
    implements IAsyncFeature<SaveCustomNpcRequest, Result<Npc>>
{
    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
    }

    public async handleAsync(request: SaveCustomNpcRequest): Promise<Result<Npc>> {
        try {
            this.setErrorResultFields(request.id, MessageKeys.createCustomNpcFailed, MessageKeys.editCustomNpcFailed);

            const npc = NpcMap.fromFormFields(request.formFields);
            npc.id = request.id;

            const validationResults: string[] = npc.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(new ResultError(this.errorCode, this.baseFailureMessage, validationResults));
            }

            npc.saveToDatabase(this.unitOfWork);

            await this.unitOfWork.saveChanges();

            return Result.success(npc);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error(`Error while creating a new NPC`, ex);

            return this.createExceptionResult<Npc>(ex);
        }
    }
}
