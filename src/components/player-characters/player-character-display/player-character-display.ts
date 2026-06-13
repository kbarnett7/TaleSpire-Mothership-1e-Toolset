import html from "./player-character-display.html";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { BaseComponent } from "../../base.component";

export class PlayerCharacterDisplayComponent extends BaseComponent {
    private playerCharacter: PlayerCharacter;

    constructor() {
        super();
        this.playerCharacter = new PlayerCharacter();
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
        const paragraph = this.shadow.querySelector("#playerCharacterClass") as HTMLParagraphElement;
        paragraph.textContent = this.playerCharacter.characterClass;
    }

    private updateDescription() {
        const paragraph = this.shadow.querySelector("#playerCharacterDescription") as HTMLParagraphElement;
        paragraph.textContent = this.playerCharacter.description;
    }
}

customElements.define("player-character-display", PlayerCharacterDisplayComponent);
