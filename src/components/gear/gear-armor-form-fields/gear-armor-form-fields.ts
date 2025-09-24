import html from "./gear-armor-form-fields.html";
import { BaseComponent } from "../../base.component";
import { ArmorItemFormFieldsDto } from "../../../features/gear/armor-item-form-fields-dto";
import { ArmorItem } from "../../../features/gear/armor-item";
import { SelectOption } from "../../../lib/selects/select-option";
import { CustomSelectComponent } from "../../custom-select/custom-select";
import { ArmorSpeed } from "../../../features/gear/armor-speed";

export class GearArmorFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: ArmorItemFormFieldsDto;

    public get armorPointsInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputArmorPoints") as HTMLInputElement;
    }

    public get oxygenInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputOxygen") as HTMLInputElement;
    }

    public get speedSelectElement(): CustomSelectComponent {
        return this.shadow.querySelector("#inputSpeed") as CustomSelectComponent;
    }

    public get specialInputElement(): HTMLTextAreaElement {
        return this.shadow.querySelector("#inputSpecial") as HTMLTextAreaElement;
    }

    public get value(): string {
        return this._formFieldsDto.toJson();
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = new ArmorItemFormFieldsDto();
    }

    public connectedCallback() {
        this.render(html);
        this.configureSpeedSelectElement();
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public setInitialFormValues(item: ArmorItem) {
        this.armorPointsInputElement.value = item.armorPoints.toString();
        this.oxygenInputElement.value = item.oxygen.toString();
        this.speedSelectElement.value = item.speed;
        this.specialInputElement.value = item.special;

        this._formFieldsDto.armorPoints = item.armorPoints.toString();
        this._formFieldsDto.oxygen = item.oxygen.toString();
        this._formFieldsDto.speed = item.speed;
        this._formFieldsDto.special = item.special;

        this.updateFormValue();
    }

    private configureSpeedSelectElement() {
        this.speedSelectElement.onOptionChange = this.handleOnSpeedSelectChanged;
        this.populateSpeedSelectElement();
    }

    private populateSpeedSelectElement() {
        const speedOptions = [
            new SelectOption(ArmorSpeed.Normal, "Normal"),
            new SelectOption(ArmorSpeed.Advantage, "Advantage [+]"),
            new SelectOption(ArmorSpeed.Disadvantage, "Disadvantage [-]"),
        ];

        this.speedSelectElement.populateOptions(speedOptions);
    }

    public handleOnArmorPointsInputChanged(event: Event) {
        this._formFieldsDto.armorPoints = this.armorPointsInputElement.value;
        this.updateFormValue();
    }

    public handleOnOxygenInputChanged(event: Event) {
        this._formFieldsDto.oxygen = this.oxygenInputElement.value;
        this.updateFormValue();
    }

    public handleOnSpeedSelectChanged = (newValue: SelectOption) => {
        this._formFieldsDto.speed = newValue.value;
        this.updateFormValue();
    };

    public handleOnSpecialInputChanged(event: Event) {
        this._formFieldsDto.special = this.specialInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("gear-armor-form-fields", GearArmorFormFieldsComponent);
