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

export class NewPlayerCharacterComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private playerCharacter: PlayerCharacter;
    private wizard: PlayerCharacterCreationWizard;
    private currentStep: string;

    private get stepDivElement(): HTMLDivElement {
        return this.shadow.querySelector("#stepDiv") as HTMLDivElement;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.playerCharacter = this.createInvalidPlayerCharacter();
        this.wizard = new PlayerCharacterCreationWizard(this.playerCharacter, this.unitOfWork);
        this.currentStep = "";
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);
        this.renderCurrentStep();
    }

    private createInvalidPlayerCharacter(): PlayerCharacter {
        return new PlayerCharacter(0, "", 0, "");
    }

    private renderCurrentStep() {
        const uiComponent = this.wizard.getCurrentUiComponent();
        const stepElement = document.createElement(uiComponent);

        stepElement.id = "formFields";
        stepElement.setAttribute("name", "formFields");

        this.currentStep = uiComponent;
        this.stepDivElement.replaceChildren();
        this.stepDivElement.appendChild(stepElement);
        this.hydrateStepElement(stepElement, uiComponent);
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
        switch (this.currentStep) {
            case "roll-stats": {
                const dto = this.getStatsFormFields(formData);
                this.wizard.setBaseStats(
                    Number(dto.strength),
                    Number(dto.speed),
                    Number(dto.intellect),
                    Number(dto.combat),
                );
                break;
            }

            case "roll-saves": {
                break;
            }

            default: {
                break;
            }
        }
    }

    private getStatsFormFields(formData: FormData): StatsFormFieldsDto {
        return StatsFormFieldsDto.createFromJson(
            formData.get("formFields")?.toString() ?? new StatsFormFieldsDto().toJson(),
        );
    }
}

customElements.define("new-player-character-page", NewPlayerCharacterComponent);
