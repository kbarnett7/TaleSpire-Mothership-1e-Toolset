import html from "./roll-stats.html";
import { StatsFormFieldsDto } from "../../features/player-characters/stats-form-fields-dto";
import { BaseComponent } from "../base.component";

export class RollStatsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: StatsFormFieldsDto;

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
        //this.weaponCategorySelectElement.value = dto.category;

        //this._formFieldsDto.category = dto.category;

        this.updateFormValue();
    }

    public handleOnShotsInputChanged(event: Event) {
        //this._formFieldsDto.shots = this.shotsInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("roll-stats", RollStatsComponent);
