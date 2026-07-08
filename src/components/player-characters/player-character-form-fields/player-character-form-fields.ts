import html from "./player-character-form-fields.html";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterFormFieldsDto } from "../../../features/player-characters/player-character-form-fields-dto";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { BaseComponent } from "../../base.component";
import { CustomSelectComponent } from "../../custom-select/custom-select";
import { SelectOption } from "../../../lib/selects/select-option";
import { CharacterClass } from "../../../features/character-class/character-class";

export class PlayerCharacterFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: PlayerCharacterFormFieldsDto;
    private readonly unitOfWork: IUnitOfWork;

    public get nameInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputName") as HTMLInputElement;
    }

    public get characterClassSelectElement(): CustomSelectComponent {
        return this.shadow.querySelector("#inputCharacterClass") as CustomSelectComponent;
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
        this._formFieldsDto = new PlayerCharacterFormFieldsDto();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
    }

    public connectedCallback() {
        this.render(html);
        this.configureCharacterClassSelectElement();
        this.updateFormValue();
    }

    private configureCharacterClassSelectElement() {
        this.characterClassSelectElement.onOptionChange = this.handleOnCharacterClassInputChanged;
        this.populateCharacterClassSelectElement();
    }

    private populateCharacterClassSelectElement() {
        const characterClasses = this.unitOfWork.repo(CharacterClass).list();
        const characterClassOptions = [];

        for (let characterClass of characterClasses) {
            characterClassOptions.push(new SelectOption(characterClass.id.toString(), characterClass.name));
        }

        this.characterClassSelectElement.populateOptions(characterClassOptions);
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public setInitialFormValues(pc: PlayerCharacter) {
        this.nameInputElement.value = pc.name;
        this.characterClassSelectElement.value = pc.characterClassId.toString();
        this.descriptionInputElement.value = pc.description;

        this._formFieldsDto.name = pc.name;
        this._formFieldsDto.characterClassId = pc.characterClassId.toString();
        this._formFieldsDto.description = pc.description;

        this.updateFormValue();
    }

    public handleOnNameInputChanged(event: Event) {
        this._formFieldsDto.name = this.nameInputElement.value;
        this.updateFormValue();
    }

    public handleOnCharacterClassInputChanged = (newValue: SelectOption) => {
        this._formFieldsDto.characterClassId = newValue.value;
        this.updateFormValue();
    };

    public handleOnDescriptionInputChanged(event: Event) {
        this._formFieldsDto.description = this.descriptionInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("player-character-form-fields", PlayerCharacterFormFieldsComponent);
