import html from "./roll-saves.html";
import { SavesFormFieldsDto } from "../../features/player-characters/saves-form-fields-dto";
import { BaseComponent } from "../base.component";

export class RollSavesComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: SavesFormFieldsDto;

    public get value(): string {
        return this._formFieldsDto.toJson();
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = new SavesFormFieldsDto();
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public setInitialFormValues(dto: SavesFormFieldsDto) {
        //this.weaponCategorySelectElement.value = dto.category;

        //this._formFieldsDto.category = dto.category;

        this.updateFormValue();
    }

    public handleOnShotsInputChanged(event: Event) {
        //this._formFieldsDto.shots = this.shotsInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("roll-saves", RollSavesComponent);
