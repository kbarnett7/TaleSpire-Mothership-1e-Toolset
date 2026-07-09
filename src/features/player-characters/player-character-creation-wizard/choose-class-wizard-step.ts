import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { PlayerCharacter } from "../player-character";
import { PlayerCharacterWizardStep } from "./player-character-wizard-step";

export class ChooseClassWizardStep extends PlayerCharacterWizardStep {
    private readonly unitOfWork: IUnitOfWork;

    constructor(playerCharacter: PlayerCharacter, unitOfWork: IUnitOfWork) {
        super(playerCharacter, "Choose Class");

        this.unitOfWork = unitOfWork;
    }

    public override canMoveNext(): boolean {
        return this.playerCharacter.validateCharacterClass(this.unitOfWork);
    }
}
