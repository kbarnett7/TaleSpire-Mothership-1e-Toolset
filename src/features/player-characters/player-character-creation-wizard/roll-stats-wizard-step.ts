import { PlayerCharacter } from "../player-character";
import { PlayerCharacterWizardStep } from "./player-character-wizard-step";

export class RollStatsWizardStep extends PlayerCharacterWizardStep {
    constructor(playerCharacter: PlayerCharacter) {
        super(playerCharacter, "Roll Stats", "roll-stats");
    }

    public override canMoveNext(): boolean {
        return (
            this.playerCharacter.validateBaseStrength() &&
            this.playerCharacter.validateBaseSpeed() &&
            this.playerCharacter.validateBaseIntellect() &&
            this.playerCharacter.validateBaseCombat()
        );
    }
}
