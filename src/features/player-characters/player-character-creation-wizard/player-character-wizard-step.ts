import { LinearWizardStepBase } from "../../../lib/wizard-state-machine/linear-wizard-step";
import { PlayerCharacter } from "../player-character";

export class PlayerCharacterWizardStep extends LinearWizardStepBase {
    protected playerCharacter: PlayerCharacter;

    constructor(playerCharacter: PlayerCharacter, title?: string) {
        super(title);
        this.playerCharacter = playerCharacter;
    }
}
