import html from "./roll-stats.html";
import { StatsFormFieldsDto } from "../../features/player-characters/stats-form-fields-dto";
import { BaseComponent } from "../base.component";

export class RollStatsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: StatsFormFieldsDto;

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
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public setInitialFormValues(dto: StatsFormFieldsDto) {
        this.strengthInputElement.value = dto.strength.toString();
        this.speedInputElement.value = dto.speed.toString();
        this.intellectInputElement.value = dto.intellect.toString();
        this.combatInputElement.value = dto.combat.toString();

        this._formFieldsDto.strength = dto.strength.toString();
        this._formFieldsDto.speed = dto.speed.toString();
        this._formFieldsDto.intellect = dto.intellect.toString();
        this._formFieldsDto.combat = dto.combat.toString();

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
}

customElements.define("roll-stats", RollStatsComponent);
