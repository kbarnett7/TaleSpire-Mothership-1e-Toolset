import html from "./new-player-character.html";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { BasePageComponent } from "../base-page.component";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../../features/player-characters/player-character-creation-wizard/player-character-creation-wizard";

export class NewPlayerCharacterComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private playerCharacter: PlayerCharacter;
    private wizard: PlayerCharacterCreationWizard;

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.playerCharacter = new PlayerCharacter();
        this.wizard = new PlayerCharacterCreationWizard(this.playerCharacter, this.unitOfWork);
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
    }
}

customElements.define("new-player-character-page", NewPlayerCharacterComponent);
