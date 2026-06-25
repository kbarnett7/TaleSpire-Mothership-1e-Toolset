import { LinearWizardStateMachine } from "../../../lib/wizard-state-machine/linear-wizard-state-machine";
import { PlayerCharacter } from "../player-character";
import { ChooseClassWizardStep } from "./choose-class-wizard-step";
import { ChooseSkillsWizardStep } from "./choose-skills-wizard-step";
import { FinishingWizardStep } from "./finishing-wizard-step";
import { GainStressWizardStep } from "./gain-stress-wizard-step";
import { NoteTraumaResponseWizardStep } from "./note-trauma-response-wizard-step";
import { RollHealthWizardStep } from "./roll-health-wizard-step";
import { RollLoadoutWizardStep } from "./roll-loadout-wizard-step";
import { RollSavesWizardStep } from "./roll-saves-wizard-step";
import { RollStatsWizardStep } from "./roll-stats-wizard-step";

export class PlayerCharacterCreationWizard extends LinearWizardStateMachine {
    private playerCharacter: PlayerCharacter;

    constructor(playerCharacter: PlayerCharacter) {
        super([
            new RollStatsWizardStep(playerCharacter),
            new RollSavesWizardStep(playerCharacter),
            new ChooseClassWizardStep(),
            new RollHealthWizardStep(),
            new GainStressWizardStep(),
            new NoteTraumaResponseWizardStep(),
            new ChooseSkillsWizardStep(),
            new RollLoadoutWizardStep(),
            new FinishingWizardStep(),
        ]);

        this.playerCharacter = playerCharacter;
    }
}
