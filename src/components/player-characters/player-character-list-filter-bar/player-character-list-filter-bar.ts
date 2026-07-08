import html from "./player-character-list-filter-bar.html";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterFilterChangedEvent } from "../../../lib/events/player-character-filter-changed-event";
import { EventBus } from "../../../lib/events/event-bus";
import { SelectOption } from "../../../lib/selects/select-option";
import { BaseListFilterBarComponent } from "../../base-list-filter-bar/base-list-filter-bar";
import { CustomSelectComponent } from "../../custom-select/custom-select";
import { CharacterClass } from "../../../features/character-class/character-class";

export class PlayerCharacterListFilterBarComponent extends BaseListFilterBarComponent {
    private currentCharacterClassId: number;

    private get characterClassesSelectElement(): CustomSelectComponent {
        return this.shadow.querySelector("#characterClassesFilter") as CustomSelectComponent;
    }

    constructor() {
        super();
        this.currentCharacterClassId = 0;
    }

    public connectedCallback() {
        this.render(html);
        this.configureClassFilter();
    }

    private configureClassFilter() {
        this.characterClassesSelectElement.onOptionChange = this.handleOnClassFilterChanged;
        this.characterClassesSelectElement.containerCssClassList.add("h-full");
        this.characterClassesSelectElement.customSelectButtonCssClassList.add("h-full");
        this.populateCharacterClassesFilter();
    }

    public handleOnClassFilterChanged = (newValue: SelectOption) => {
        const selectedValue = newValue.value;

        this.currentCharacterClassId = parseInt(selectedValue);

        this.dispatchFilterChangedEvent();
    };

    private populateCharacterClassesFilter() {
        const characterClasses = this.unitOfWork.repo(CharacterClass).list();
        const characterClassOptions = [new SelectOption("0", "All")];

        for (let characterClass of characterClasses) {
            characterClassOptions.push(new SelectOption(characterClass.id.toString(), characterClass.name));
        }

        this.characterClassesSelectElement.populateOptions(characterClassOptions);
    }

    protected dispatchFilterChangedEvent() {
        const appEvent = new PlayerCharacterFilterChangedEvent(this.currentSearch, this.currentCharacterClassId);

        EventBus.instance.dispatch(appEvent);
    }
}

customElements.define("player-character-list-filter-bar", PlayerCharacterListFilterBarComponent);
