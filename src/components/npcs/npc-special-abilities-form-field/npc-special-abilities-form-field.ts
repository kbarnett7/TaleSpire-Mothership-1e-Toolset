import html from "./npc-special-abilities-form-field.html";
import { BaseComponent } from "../../base.component";
import { NpcSpecialAbilityFormFieldsDto } from "../../../features/npcs/npc-special-ability-form-fields-dto";

export class NpcSpecialAbilitiesFormFieldComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: NpcSpecialAbilityFormFieldsDto[];

    public get value(): string {
        return JSON.stringify(this._formFieldsDto);
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = [];
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }
}

customElements.define("npc-special-abilities-form-field", NpcSpecialAbilitiesFormFieldComponent);
