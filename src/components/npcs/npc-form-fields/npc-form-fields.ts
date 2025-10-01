import html from "./npc-form-fields.html";
import { NpcFormFieldsDto } from "../../../features/npcs/npc-form-fields-dto";
import { BaseComponent } from "../../base.component";

export class NpcFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: NpcFormFieldsDto;

    public get value(): string {
        return this._formFieldsDto.toJson();
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = new NpcFormFieldsDto();
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }
}

customElements.define("npc-form-fields", NpcFormFieldsComponent);
