import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { CharacterClass } from "../character-class";
import { GetCharacterClassByIdRequest } from "./get-character-class-by-id-request";

export class GetCharacterClassByIdFeature implements IFeature<GetCharacterClassByIdRequest, CharacterClass> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: GetCharacterClassByIdRequest): CharacterClass {
        return (
            this.unitOfWork.repo(CharacterClass).first((characterClass) => characterClass.id === request.id) ??
            new CharacterClass()
        );
    }
}
