import { PlayerCharacter } from "../player-character";
import { PlayerCharacterWizardStep } from "./player-character-wizard-step";

export class RollLoadoutWizardStep extends PlayerCharacterWizardStep {
    constructor(playerCharacter: PlayerCharacter) {
        super(playerCharacter, "Roll Loadout", "roll-loadout");
    }
}
