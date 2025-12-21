import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { PlayerCharacter } from "../player-character";
import { PlayerCharacterListItem } from "../player-character-list-item";
import { PlayerCharacterListItemMap } from "../player-character-list-item-map";

export class GetAllPlayerCharactersFeature implements IFeature<EmptyRequest, PlayerCharacterListItem[]> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: EmptyRequest): PlayerCharacterListItem[] {
        return this.unitOfWork.repo(PlayerCharacter).list().map(PlayerCharacterListItemMap.fromNpc);
    }
}
