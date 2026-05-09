import html from "./player-character-list-filter-bar.html";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterFilterChangedEvent } from "../../../lib/events/player-character-filter-changed-event";
import { EventBus } from "../../../lib/events/event-bus";
import { SelectOption } from "../../../lib/selects/select-option";
import { BaseListFilterBarComponent } from "../../base-list-filter-bar/base-list-filter-bar";
import { CustomSelectComponent } from "../../custom-select/custom-select";

export class PlayerCharacterListFilterBarComponent extends BaseListFilterBarComponent {
    private currentCharacterClass: string = "";

    private get classFilterElement(): CustomSelectComponent {
        return this.shadow.querySelector("#classFilter") as CustomSelectComponent;
    }

    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);
        this.configureClassFilter();
    }

    private configureClassFilter() {
        const allPcs = this.unitOfWork.repo(PlayerCharacter).list();
        const distinctClasses = [...new Set(allPcs.map((pc) => pc.characterClass))].sort();

        const options = [new SelectOption("", "All"), ...distinctClasses.map((c) => new SelectOption(c, c))];

        this.classFilterElement.onOptionChange = this.handleOnClassFilterChanged;
        this.classFilterElement.containerCssClassList.add("h-full");
        this.classFilterElement.customSelectButtonCssClassList.add("h-full");
        this.classFilterElement.populateOptions(options);
    }

    public handleOnClassFilterChanged = (newValue: SelectOption) => {
        this.currentCharacterClass = newValue.value;
        this.dispatchFilterChangedEvent();
    };

    protected dispatchFilterChangedEvent() {
        const appEvent = new PlayerCharacterFilterChangedEvent(this.currentSearch, this.currentCharacterClass);

        EventBus.instance.dispatch(appEvent);
    }
}

customElements.define("player-character-list-filter-bar", PlayerCharacterListFilterBarComponent);
