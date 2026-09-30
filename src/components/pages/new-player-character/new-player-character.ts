import html from "./new-player-character.html";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { BasePageComponent } from "../base-page.component";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../../features/player-characters/player-character-creation-wizard/player-character-creation-wizard";
import { RollStatsComponent } from "../../roll-stats/roll-stats";
import { StatsFormFieldsDto } from "../../../features/player-characters/stats-form-fields-dto";
import { EventBus } from "../../../lib/events/event-bus";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { BaseFormComponent } from "../../base-form/base-form-component";
import { BaseDto } from "../../../lib/dto/base-dto";
import { BaseNewPlayerCharacterWizardComponent } from "../../base-new-player-character-wizard-component/base-new-player-character-wizard-component";

export class NewPlayerCharacterComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private playerCharacter: PlayerCharacter;
    private wizard: PlayerCharacterCreationWizard;

    private get stepDivElement(): HTMLDivElement {
        return this.shadow.querySelector("#stepDiv") as HTMLDivElement;
    }

    private get stepElement(): BaseNewPlayerCharacterWizardComponent {
        return this.shadow.querySelector("#formFields") as BaseNewPlayerCharacterWizardComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.playerCharacter = new PlayerCharacter(0, "", 0, "");
        this.wizard = new PlayerCharacterCreationWizard(this.playerCharacter, this.unitOfWork);
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
        this.renderCurrentStep();
    }

    private renderCurrentStep() {
        const uiComponent = this.wizard.getCurrentUiComponent();
        const stepElement = document.createElement(uiComponent);

        stepElement.id = "formFields";
        stepElement.setAttribute("name", "formFields");

        this.stepDivElement.replaceChildren();
        this.stepDivElement.appendChild(stepElement);
        this.hydrateStepElement(stepElement, uiComponent);
    }

    private hydrateStepElement(uiElement: HTMLElement, uiComponent: string) {
        (uiElement as BaseNewPlayerCharacterWizardComponent).initialize(this.playerCharacter);
    }

    public handleFormSubmit(event: SubmitEvent) {
        event.preventDefault();

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        if (event.submitter?.id === "previousButton") {
            this.handlePreviousButtonClick(formData);
        } else if (event.submitter?.id === "nextButton") {
            this.handleNextButtonClick(formData);
        }
    }

    private handlePreviousButtonClick(formData: FormData) {
        if (this.wizard.movePrevious()) {
            this.updatePlayerCharacterWithCurrentStepValues(formData);
            this.renderCurrentStep();
        }
    }

    private handleNextButtonClick(formData: FormData) {
        if (this.wizard.moveNext()) {
            this.updatePlayerCharacterWithCurrentStepValues(formData);
            this.renderCurrentStep();
        }
    }

    private updatePlayerCharacterWithCurrentStepValues(formData: FormData) {
        this.stepElement.updatePlayer(this.wizard, formData);
    }
}

customElements.define("new-player-character-page", NewPlayerCharacterComponent);
