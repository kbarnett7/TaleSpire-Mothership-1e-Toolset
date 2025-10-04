import html from "./npc-attacks-form-field.ts.html";
import { BaseComponent } from "../../base.component";
import { NpcAttackFormFieldsDto } from "../../../features/npcs/npc-attack-form-fields-dto";

export class NpcAttacksFormFieldComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: NpcAttackFormFieldsDto[];

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

customElements.define("npc-attacks-form-field", NpcAttacksFormFieldComponent);
