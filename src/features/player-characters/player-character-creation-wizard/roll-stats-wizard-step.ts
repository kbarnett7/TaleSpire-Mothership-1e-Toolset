import { PlayerCharacter } from "../player-character";
import { PlayerCharacterWizardStep } from "./player-character-wizard-step";

export class RollStatsWizardStep extends PlayerCharacterWizardStep {
    constructor(playerCharacter: PlayerCharacter) {
        super(playerCharacter, "Roll Stats");
    }

    public override canMoveNext(): boolean {
        if (this.playerCharacter.validateStrength().getValidationResult().length > 0) {
            return false;
        }

        return true;
    }
}
