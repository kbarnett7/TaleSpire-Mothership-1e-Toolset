import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
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
    private readonly unitOfWork: IUnitOfWork;

    private playerCharacter: PlayerCharacter;

    constructor(playerCharacter: PlayerCharacter, unitOfWork: IUnitOfWork) {
        super([
            new RollStatsWizardStep(playerCharacter),
            new RollSavesWizardStep(playerCharacter),
            new ChooseClassWizardStep(playerCharacter, unitOfWork),
            new RollHealthWizardStep(),
            new GainStressWizardStep(),
            new NoteTraumaResponseWizardStep(),
            new ChooseSkillsWizardStep(),
            new RollLoadoutWizardStep(),
            new FinishingWizardStep(),
        ]);

        this.playerCharacter = playerCharacter;
        this.unitOfWork = unitOfWork;
    }

    public setBaseStats(baseStrength: number, baseSpeed: number, baseIntellect: number, baseCombat: number) {
        this.playerCharacter.strength = baseStrength;
        this.playerCharacter.speed = baseSpeed;
        this.playerCharacter.intellect = baseIntellect;
        this.playerCharacter.combat = baseCombat;
    }
}
