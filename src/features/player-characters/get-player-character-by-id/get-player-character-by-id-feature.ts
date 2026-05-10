import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { PlayerCharacter } from "../player-character";
import { GetPlayerCharacterByIdRequest } from "./get-player-character-by-id-request";

export class GetPlayerCharacterByIdFeature implements IFeature<GetPlayerCharacterByIdRequest, PlayerCharacter> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: GetPlayerCharacterByIdRequest): PlayerCharacter {
        return this.unitOfWork.repo(PlayerCharacter).first((pc) => pc.id === request.id) ?? new PlayerCharacter();
    }
}
