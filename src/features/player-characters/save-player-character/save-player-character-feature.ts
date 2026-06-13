import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { SaveDbEntityFeature } from "../../../lib/common/features/save-db-entity-feature";
import { MessageKeys } from "../../../lib/localization/message-keys";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { PlayerCharacter } from "../player-character";
import { PlayerCharacterMap } from "../player-character-map";
import { SavePlayerCharacterRequest } from "./save-player-character-request";

export class SavePlayerCharacterFeature
    extends SaveDbEntityFeature
    implements IAsyncFeature<SavePlayerCharacterRequest, Result<PlayerCharacter>>
{
    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
    }

    public async handleAsync(request: SavePlayerCharacterRequest): Promise<Result<PlayerCharacter>> {
        try {
            this.setErrorResultFields(
                request.id,
                MessageKeys.createPlayerCharacterFailed,
                MessageKeys.editPlayerCharacterFailed
            );

            const pc = PlayerCharacterMap.fromFormFields(request.formFields);
            pc.id = request.id;

            const validationResults: string[] = pc.validate(this.unitOfWork);

            if (validationResults.length > 0) {
                return Result.failure(new ResultError(this.errorCode, this.baseFailureMessage, validationResults));
            }

            pc.saveToDatabase(this.unitOfWork);

            await this.unitOfWork.saveChanges();

            return Result.success(pc);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error("Error while saving a player character", ex);

            return this.createExceptionResult<PlayerCharacter>(ex);
        }
    }
}
