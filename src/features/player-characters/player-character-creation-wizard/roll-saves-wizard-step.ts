import { PlayerCharacter } from "../player-character";
import { PlayerCharacterWizardStep } from "./player-character-wizard-step";

export class RollSavesWizardStep extends PlayerCharacterWizardStep {
    constructor(playerCharacter: PlayerCharacter) {
        super(playerCharacter, "Roll Saves");
    }

    public override canMoveNext(): boolean {
        return (
            this.playerCharacter.validateSanity() &&
            this.playerCharacter.validateFear() &&
            this.playerCharacter.validateBody()
        );
    }
}
