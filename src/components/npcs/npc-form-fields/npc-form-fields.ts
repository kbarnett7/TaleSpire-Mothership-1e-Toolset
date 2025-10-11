import html from "./npc-form-fields.html";
import { NpcFormFieldsDto } from "../../../features/npcs/npc-form-fields-dto";
import { BaseComponent } from "../../base.component";
import { Npc } from "../../../features/npcs/npc";
import { EventBus } from "../../../lib/events/event-bus";
import { AddNpcAttackButtonClicked } from "../../../lib/events/add-npc-attack-button-clicked";
import { NpcAttacksFormFieldComponent } from "../npc-attacks-form-field/npc-attacks-form-field";
import { NpcAttackFormFieldsDto } from "../../../features/npcs/npc-attack-form-fields-dto";
import { AddNpcSpecialAbilityButtonClicked } from "../../../lib/events/add-npc-special-ability-button-clicked";
import { NpcSpecialAbilitiesFormFieldComponent } from "../npc-special-abilities-form-field/npc-special-abilities-form-field";
import { NpcSpecialAbilityFormFieldsDto } from "../../../features/npcs/npc-special-ability-form-fields-dto";

export class NpcFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: NpcFormFieldsDto;

    public get nameInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputName") as HTMLInputElement;
    }

    public get combatInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputCombat") as HTMLInputElement;
    }

    public get instinctInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputInstinct") as HTMLInputElement;
    }

    public get healthInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputHealth") as HTMLInputElement;
    }

    public get woundsInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputWounds") as HTMLInputElement;
    }

    public get armorPointsInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputArmorPoints") as HTMLInputElement;
    }

    public get descriptionInputElement(): HTMLTextAreaElement {
        return this.shadow.querySelector("#inputDescription") as HTMLTextAreaElement;
    }

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

    public setInitialFormValues(npc: Npc) {
        this.nameInputElement.value = npc.name;
        this.combatInputElement.value = npc.combat.toString();
        this.instinctInputElement.value = npc.instinct.toString();
        this.healthInputElement.value = npc.health.toString();
        this.woundsInputElement.value = npc.maximumWounds.toString();
        this.armorPointsInputElement.value = npc.armorPoints.toString();
        this.descriptionInputElement.value = npc.description;

        this._formFieldsDto.name = npc.name;
        this._formFieldsDto.combat = npc.combat.toString();
        this._formFieldsDto.instinct = npc.instinct.toString();
        this._formFieldsDto.health = npc.health.toString();
        this._formFieldsDto.maximumWounds = npc.maximumWounds.toString();
        this._formFieldsDto.armorPoints = npc.armorPoints.toString();
        this._formFieldsDto.description = npc.description;

        this.updateFormValue();
    }

    public handleOnNameInputChanged(event: Event) {
        this._formFieldsDto.name = this.nameInputElement.value;
        this.updateFormValue();
    }

    public handleOnCombatInputChanged(event: Event) {
        this._formFieldsDto.combat = this.combatInputElement.value;
        this.updateFormValue();
    }

    public handleOnInstinctInputChanged(event: Event) {
        this._formFieldsDto.instinct = this.instinctInputElement.value;
        this.updateFormValue();
    }

    public handleOnHealthInputChanged(event: Event) {
        this._formFieldsDto.health = this.healthInputElement.value;
        this.updateFormValue();
    }

    public handleOnWoundsInputChanged(event: Event) {
        this._formFieldsDto.maximumWounds = this.woundsInputElement.value;
        this.updateFormValue();
    }

    public handleOnArmorPointsInputChanged(event: Event) {
        this._formFieldsDto.armorPoints = this.armorPointsInputElement.value;
        this.updateFormValue();
    }

    public handleOnDescriptionInputChanged(event: Event) {
        this._formFieldsDto.description = this.descriptionInputElement.value;
        this.updateFormValue();
    }

    public handleOnAddAttackButtonClick(event: MouseEvent) {
        EventBus.instance.dispatch(new AddNpcAttackButtonClicked());
    }

    public handleOnNpcAttacksChanged(event: Event) {
        const npcAttacksJson = (event.target as NpcAttacksFormFieldComponent).value;

        this._formFieldsDto.attacks = JSON.parse(npcAttacksJson) as NpcAttackFormFieldsDto[];

        this.updateFormValue();
    }

    public handleOnAddSpecialAbilityButtonClick(event: MouseEvent) {
        EventBus.instance.dispatch(new AddNpcSpecialAbilityButtonClicked());
    }

    public handleOnNpcSpecialAbilitiesChanged(event: Event) {
        const npcSpecialAbilitiesJson = (event.target as NpcSpecialAbilitiesFormFieldComponent).value;

        this._formFieldsDto.specialAbilities = JSON.parse(npcSpecialAbilitiesJson) as NpcSpecialAbilityFormFieldsDto[];

        this.updateFormValue();
    }
}

customElements.define("npc-form-fields", NpcFormFieldsComponent);
