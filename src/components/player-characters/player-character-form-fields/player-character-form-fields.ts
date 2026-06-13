import html from "./player-character-form-fields.html";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterFormFieldsDto } from "../../../features/player-characters/player-character-form-fields-dto";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { BaseComponent } from "../../base.component";

export class PlayerCharacterFormFieldsComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: PlayerCharacterFormFieldsDto;
    private readonly unitOfWork: IUnitOfWork;

    public get nameInputElement(): HTMLInputElement {
        return this.shadow.querySelector("#inputName") as HTMLInputElement;
    }

    public get classSelectElement(): HTMLSelectElement {
        return this.shadow.querySelector("#inputClass") as HTMLSelectElement;
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
        this.populateClassSelect();
        this.updateFormValue();
    }

    private populateClassSelect() {
        const allPcs = this.unitOfWork.repo(PlayerCharacter).list();
        const defaultClasses = ["Android", "Scientist", "Marine", "Teamster"];
        const distinctClasses = [
            ...new Set([...defaultClasses, ...allPcs.map((pc) => pc.characterClass)].filter((c) => c.trim() !== "")),
        ].sort((a, b) => a.localeCompare(b));

        const selectEl = this.classSelectElement;
        selectEl.replaceChildren();

        for (const cls of distinctClasses) {
            const option = document.createElement("option");
            option.value = cls;
            option.textContent = cls;
            selectEl.appendChild(option);
        }

        // Ensure the DTO always has a valid, selectable value.
        const selectedClass = distinctClasses[0] ?? "";
        this._formFieldsDto.characterClass = selectedClass;
        selectEl.value = selectedClass;
        this.updateFormValue();
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public setInitialFormValues(pc: PlayerCharacter) {
        this.nameInputElement.value = pc.name;
        this.classSelectElement.value = pc.characterClass;
        this.descriptionInputElement.value = pc.description;

        this._formFieldsDto.name = pc.name;
        this._formFieldsDto.characterClass = pc.characterClass;
        this._formFieldsDto.description = pc.description;

        this.updateFormValue();
    }

    public handleOnNameInputChanged(event: Event) {
        this._formFieldsDto.name = this.nameInputElement.value;
        this.updateFormValue();
    }

    public handleOnClassInputChanged(event: Event) {
        this._formFieldsDto.characterClass = this.classSelectElement.value;
        this.updateFormValue();
    }

    public handleOnDescriptionInputChanged(event: Event) {
        this._formFieldsDto.description = this.descriptionInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("player-character-form-fields", PlayerCharacterFormFieldsComponent);
