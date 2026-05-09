import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { Result } from "../../../lib/result/result";
import { PlayerCharacter } from "../player-character";
import { DeletePlayerCharacterRequest } from "./delete-player-character-request";

export class DeletePlayerCharacterFeature implements IAsyncFeature<DeletePlayerCharacterRequest, Result<number>> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public async handleAsync(request: DeletePlayerCharacterRequest): Promise<Result<number>> {
        const pc =
            this.unitOfWork.repo(PlayerCharacter).first((pc) => pc.id === request.id) ?? new PlayerCharacter();

        if (pc.id === 0) {
            return Result.success(request.id);
        }

        pc.deleteFromDatabase(this.unitOfWork);

        await this.unitOfWork.saveChanges();

        return Result.success(request.id);
    }
}
