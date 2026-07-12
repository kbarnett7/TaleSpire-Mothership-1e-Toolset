import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { LinearWizardStateMachine } from "../../../lib/wizard-state-machine/linear-wizard-state-machine";
import { CharacterClass } from "../../character-class/character-class";
import { StatModifier } from "../../stat-modifiers/stat-modifier";
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
        this.playerCharacter.baseStrength = baseStrength;
        this.playerCharacter.baseSpeed = baseSpeed;
        this.playerCharacter.baseIntellect = baseIntellect;
        this.playerCharacter.baseCombat = baseCombat;
    }

    public setBaseSaves(baseSanity: number, baseFear: number, baseBody: number) {
        this.playerCharacter.baseSanity = baseSanity;
        this.playerCharacter.baseFear = baseFear;
        this.playerCharacter.baseBody = baseBody;
    }

    public setCharacterClass(characterClassId: number, userChoiceStats?: StatModifier[]) {
        this.playerCharacter.characterClassId = characterClassId;

        const characteClass =
            this.unitOfWork.repo(CharacterClass).first((characterClass) => characterClass.id === characterClassId) ??
            new CharacterClass();

        this.playerCharacter.addStatModifiers(characteClass.getNonUserChoiceStatModifiers());

        if (userChoiceStats) {
            let userChoiceModifiers = characteClass.getUserChoiceStatModifiers();

            for (const userChoiceStat of userChoiceStats) {
                const targetIndex = userChoiceModifiers.findIndex(
                    (modifier) => modifier.modifier === userChoiceStat.modifier,
                );

                if (targetIndex !== -1) {
                    this.playerCharacter.addStatModifiers([userChoiceStat]);

                    // TODO: is this really necessary to confirm this is a valid modifier? The UI will control it.
                    userChoiceModifiers.splice(targetIndex, 1);
                }
            }
        }
    }
}
