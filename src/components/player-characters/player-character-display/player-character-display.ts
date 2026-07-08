import html from "./player-character-display.html";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { BaseComponent } from "../../base.component";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { CharacterClass } from "../../../features/character-class/character-class";

export class PlayerCharacterDisplayComponent extends BaseComponent {
    private playerCharacter: PlayerCharacter;
    private readonly unitOfWork: IUnitOfWork;

    constructor() {
        super();
        this.playerCharacter = new PlayerCharacter();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
    }

    public connectedCallback() {
        this.render(html);
    }

    public setPlayerCharacter(pc: PlayerCharacter) {
        this.playerCharacter = pc;

        this.updateName();
        this.updateClass();
        this.updateDescription();
    }

    private updateName() {
        const paragraph = this.shadow.querySelector("#playerCharacterName") as HTMLParagraphElement;
        paragraph.textContent = this.playerCharacter.name;
    }

    private updateClass() {
        const characterClass = this.unitOfWork
            .repo(CharacterClass)
            .first((characterClass) => characterClass.id === this.playerCharacter.characterClassId);

        const paragraph = this.shadow.querySelector("#playerCharacterClass") as HTMLParagraphElement;
        paragraph.textContent = characterClass?.name ?? "";
    }

    private updateDescription() {
        const paragraph = this.shadow.querySelector("#playerCharacterDescription") as HTMLParagraphElement;
        paragraph.textContent = this.playerCharacter.description;
    }
}

customElements.define("player-character-display", PlayerCharacterDisplayComponent);
