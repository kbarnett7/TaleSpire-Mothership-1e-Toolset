import { PlayerCharacter } from "../player-character";
import { PlayerCharacterWizardStep } from "./player-character-wizard-step";

export class RollSavesWizardStep extends PlayerCharacterWizardStep {
    constructor(playerCharacter: PlayerCharacter) {
        super(playerCharacter, "Roll Saves", "roll-saves");
    }

    public override canMoveNext(): boolean {
        return (
            this.playerCharacter.validateBaseSanity() &&
            this.playerCharacter.validateBaseFear() &&
            this.playerCharacter.validateBaseBody()
        );
    }
}
