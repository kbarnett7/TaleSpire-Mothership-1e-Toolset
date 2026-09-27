import html from "./roll-stats.html";
import { StatsFormFieldsDto } from "../../features/player-characters/stats-form-fields-dto";
import { BaseComponent } from "../base.component";
import { DiceRoller } from "../../lib/dice-rollers/dice-roller";

export class RollStatsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: StatsFormFieldsDto;
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

    public get value(): string {
        return this._formFieldsDto.toJson();
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = new StatsFormFieldsDto();
        this._diceRoller = new DiceRoller();
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
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
        this._formFieldsDto.strength = value;
    }

    private setSpeed(value: string) {
        this.speedInputElement.value = value;
        this._formFieldsDto.speed = value;
    }

    private setIntellect(value: string) {
        this.intellectInputElement.value = value;
        this._formFieldsDto.intellect = value;
    }

    private setCombat(value: string) {
        this.combatInputElement.value = value;
        this._formFieldsDto.combat = value;
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

    public handleOnStrengthInputChanged(event: Event) {
        this._formFieldsDto.strength = this.strengthInputElement.value;
        this.updateFormValue();
    }

    public handleOnSpeedInputChanged(event: Event) {
        this._formFieldsDto.speed = this.speedInputElement.value;
        this.updateFormValue();
    }

    public handleOnIntellectInputChanged(event: Event) {
        this._formFieldsDto.intellect = this.intellectInputElement.value;
        this.updateFormValue();
    }

    public handleOnCombatInputChanged(event: Event) {
        this._formFieldsDto.combat = this.combatInputElement.value;
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
}

customElements.define("roll-stats", RollStatsComponent);
