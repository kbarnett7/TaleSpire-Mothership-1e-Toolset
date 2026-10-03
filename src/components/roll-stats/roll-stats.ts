import html from "./roll-stats.html";
import { StatsFormFieldsDto } from "../../features/player-characters/stats-form-fields-dto";
import { DiceRoller } from "../../lib/dice-rollers/dice-roller";
import { BaseNewPlayerCharacterWizardComponent } from "../base-new-player-character-wizard-component/base-new-player-character-wizard-component";
import { PlayerCharacter } from "../../features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../features/player-characters/player-character-creation-wizard/player-character-creation-wizard";

export class RollStatsComponent extends BaseNewPlayerCharacterWizardComponent {
    private _diceRoller: DiceRoller;

    public get strengthInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputStrength") as HTMLInputElement;
    }

    public get speedInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputSpeed") as HTMLInputElement;
    }

    public get intellectInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputIntellect") as HTMLInputElement;
    }

    public get combatInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputCombat") as HTMLInputElement;
    }

    constructor() {
        super(new StatsFormFieldsDto());
        this._diceRoller = new DiceRoller();
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    public initialize(playerCharacter: PlayerCharacter) {
        this.setInitialFormValues(
            new StatsFormFieldsDto(
                playerCharacter.baseStrength?.toString() ?? "",
                playerCharacter.baseSpeed?.toString() ?? "",
                playerCharacter.baseIntellect?.toString() ?? "",
                playerCharacter.baseCombat?.toString() ?? "",
            ),
        );
    }

    public setInitialFormValues(dto: StatsFormFieldsDto) {
        this.setStrength(dto.strength);
        this.setSpeed(dto.speed);
        this.setIntellect(dto.intellect);
        this.setCombat(dto.combat);
        this.updateFormValue();
    }

    private setStrength(value: string) {
        this.strengthInputElement.value = value;
        this.getFormFieldsDto<StatsFormFieldsDto>().strength = value;
    }

    private setSpeed(value: string) {
        this.speedInputElement.value = value;
        this.getFormFieldsDto<StatsFormFieldsDto>().speed = value;
    }

    private setIntellect(value: string) {
        this.intellectInputElement.value = value;
        this.getFormFieldsDto<StatsFormFieldsDto>().intellect = value;
    }

    private setCombat(value: string) {
        this.combatInputElement.value = value;
        this.getFormFieldsDto<StatsFormFieldsDto>().combat = value;
    }

    public updatePlayer(wizard: PlayerCharacterCreationWizard, formData: FormData) {
        const dto = this.getDtoFromFormData(formData);
        wizard.setBaseStats(Number(dto.strength), Number(dto.speed), Number(dto.intellect), Number(dto.combat));
    }

    private getDtoFromFormData(formData: FormData): StatsFormFieldsDto {
        return StatsFormFieldsDto.createFromJson(
            formData.get("formFields")?.toString() ?? new StatsFormFieldsDto().toJson(),
        );
    }

    private rollStat(): string {
        return this._diceRoller.roll(10, 2, 25).toString();
    }

    private rollStrengthStat() {
        this.setStrength(this.rollStat());
        this.updateFormValue();
    }

    private rollSpeedStat() {
        this.setSpeed(this.rollStat());
        this.updateFormValue();
    }

    private rollIntellectStat() {
        this.setIntellect(this.rollStat());
        this.updateFormValue();
    }

    private rollCombatStat() {
        this.setCombat(this.rollStat());
        this.updateFormValue();
    }

    public handleOnStrengthInput(event: Event) {
        this.setStrength(this.normalizeTo0to100(this.strengthInputElement.value));
        this.updateFormValue();
    }

    public handleOnSpeedInput(event: Event) {
        this.setSpeed(this.normalizeTo0to100(this.speedInputElement.value));
        this.updateFormValue();
    }

    public handleOnIntellectInput(event: Event) {
        this.setIntellect(this.normalizeTo0to100(this.intellectInputElement.value));
        this.updateFormValue();
    }

    public handleOnCombatInput(event: Event) {
        this.setCombat(this.normalizeTo0to100(this.combatInputElement.value));
        this.updateFormValue();
    }

    public handleRollStrengthButtonClick(event: MouseEvent) {
        this.rollStrengthStat();
    }

    public handleRollSpeedButtonClick(event: MouseEvent) {
        this.rollSpeedStat();
    }

    public handleRollIntellectButtonClick(event: MouseEvent) {
        this.rollIntellectStat();
    }

    public handleRollCombatButtonClick(event: MouseEvent) {
        this.rollCombatStat();
    }

    public handleRollAllButtonClick(event: MouseEvent) {
        this.rollStrengthStat();
        this.rollSpeedStat();
        this.rollIntellectStat();
        this.rollCombatStat();
    }

    private normalizeTo0to100(raw: string): string {
        const digitsOnly = raw.replace(/\D/g, ""); // strips letters, -, +, ., spaces, symbols

        if (digitsOnly === "") return "";

        const n = Number.parseInt(digitsOnly, 10);
        const clamped = Math.min(100, Math.max(0, n));

        return String(clamped);
    }
}

customElements.define("roll-stats", RollStatsComponent);
