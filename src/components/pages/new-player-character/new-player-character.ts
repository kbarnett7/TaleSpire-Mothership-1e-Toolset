import html from "./new-player-character.html";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { BasePageComponent } from "../base-page.component";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../../features/player-characters/player-character-creation-wizard/player-character-creation-wizard";
import { RollStatsComponent } from "../../roll-stats/roll-stats";
import { StatsFormFieldsDto } from "../../../features/player-characters/stats-form-fields-dto";

export class NewPlayerCharacterComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private playerCharacter: PlayerCharacter;
    private wizard: PlayerCharacterCreationWizard;

    private get stepDivElement(): HTMLDivElement {
        return this.shadow.querySelector("#stepDiv") as HTMLDivElement;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.playerCharacter = new PlayerCharacter();
        this.wizard = new PlayerCharacterCreationWizard(this.playerCharacter, this.unitOfWork);
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
        this.renderCurrentStep();
    }

    public handlePreviousButtonClick(event: MouseEvent) {
        if (this.wizard.movePrevious()) {
            this.renderCurrentStep();
        }
    }

    public handleNextButtonClick(event: MouseEvent) {
        if (this.wizard.moveNext()) {
            this.renderCurrentStep();
        }
    }

    private renderCurrentStep() {
        const uiComponent = this.wizard.getCurrentUiComponent();
        const stepElement = document.createElement(uiComponent);

        this.stepDivElement.replaceChildren();
        this.hydrateStepElement(stepElement, uiComponent);
        this.stepDivElement.appendChild(stepElement);
    }

    private hydrateStepElement(uiElement: HTMLElement, uiComponent: string) {
        if (uiComponent === "roll-stats") {
            (uiElement as RollStatsComponent).setInitialFormValues(this.getBaseStatsFormFields());
        }
    }

    private getBaseStatsFormFields(): StatsFormFieldsDto {
        return new StatsFormFieldsDto(
            this.playerCharacter.baseStrength?.toString() ?? "",
            this.playerCharacter.baseSpeed?.toString() ?? "",
            this.playerCharacter.baseIntellect?.toString() ?? "",
            this.playerCharacter.baseCombat?.toString() ?? "",
        );
    }
}

customElements.define("new-player-character-page", NewPlayerCharacterComponent);
