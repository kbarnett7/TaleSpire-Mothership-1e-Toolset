import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { GetCharacterClassByIdFeature } from "../../character-class/get-character-class-by-id/get-character-class-by-id-feature";
import { GetCharacterClassByIdRequest } from "../../character-class/get-character-class-by-id/get-character-class-by-id-request";
import { PlayerCharacter } from "../player-character";
import { PlayerCharacterListItem } from "../player-character-list-item";

export class GetAllPlayerCharactersFeature implements IFeature<EmptyRequest, PlayerCharacterListItem[]> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: EmptyRequest): PlayerCharacterListItem[] {
        return this.unitOfWork
            .repo(PlayerCharacter)
            .list()
            .map((pc) => {
                const getByIdFeature = new GetCharacterClassByIdFeature(this.unitOfWork);
                const characterClass = getByIdFeature.handle(new GetCharacterClassByIdRequest(pc.characterClassId));

                return new PlayerCharacterListItem(
                    pc.id,
                    pc.name,
                    pc.characterClassId,
                    characterClass.name,
                    pc.description,
                );
            });
    }
}
