import html from "./new-player-character.html";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { BasePageComponent } from "../base-page.component";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../../features/player-characters/player-character-creation-wizard/player-character-creation-wizard";
import { EventBus } from "../../../lib/events/event-bus";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { BaseNewPlayerCharacterWizardComponent } from "../../base-new-player-character-wizard-component/base-new-player-character-wizard-component";
import { PlayerCharacterWizardStep } from "../../../features/player-characters/player-character-creation-wizard/player-character-wizard-step";

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

    private get previousButtonElement(): HTMLButtonElement {
        return this.shadow.querySelector("#previousButton") as HTMLButtonElement;
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
        this.hydrateStepElement(stepElement);
        this.enableDisablePreviousButton();
    }

    private hydrateStepElement(uiElement: HTMLElement) {
        (uiElement as BaseNewPlayerCharacterWizardComponent).initialize(this.playerCharacter);
    }

    private enableDisablePreviousButton() {
        this.previousButtonElement.disabled = !this.wizard.canMovePrevious();
    }

    public handleFormSubmit(event: SubmitEvent) {
        event.preventDefault();

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        this.updatePlayerCharacterWithCurrentStepValues(event.target as HTMLFormElement);

        if (event.submitter?.id === "previousButton") {
            this.handlePreviousButtonClick();
        } else if (event.submitter?.id === "nextButton") {
            this.handleNextButtonClick();
        }
    }

    private handlePreviousButtonClick() {
        if (this.wizard.movePrevious()) {
            this.renderCurrentStep();
        }
    }

    private handleNextButtonClick() {
        if (this.wizard.moveNext()) {
            this.renderCurrentStep();
        }
    }

    private updatePlayerCharacterWithCurrentStepValues(form: HTMLFormElement) {
        this.stepElement.updatePlayer(this.wizard, new FormData(form));
    }
}

customElements.define("new-player-character-page", NewPlayerCharacterComponent);
