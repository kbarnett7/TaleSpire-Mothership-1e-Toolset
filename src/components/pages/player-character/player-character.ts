import html from "./player-character.html";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { BasePageComponent } from "../base-page.component";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { PlayerCharacterFormFieldsComponent } from "../../player-characters/player-character-form-fields/player-character-form-fields";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { EventBus } from "../../../lib/events/event-bus";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { UiReportableErrorOccurredEvent } from "../../../lib/events/ui-reportable-error-occurred-event";
import { SavePlayerCharacterRequest } from "../../../features/player-characters/save-player-character/save-player-character-request";
import { SavePlayerCharacterFeature } from "../../../features/player-characters/save-player-character/save-player-character-feature";
import { PlayerCharacterFormFieldsDto } from "../../../features/player-characters/player-character-form-fields-dto";
import { GetPlayerCharacterByIdRequest } from "../../../features/player-characters/get-player-character-by-id/get-player-character-by-id-request";
import { GetPlayerCharacterByIdFeature } from "../../../features/player-characters/get-player-character-by-id/get-player-character-by-id-feature";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { ResultError } from "../../../lib/result/result-error";

export class PlayerCharacterComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private playerCharacterIdFromUrl: number;

    private get playerCharacterFormFieldsComponent(): PlayerCharacterFormFieldsComponent {
        return this.shadow.querySelector("#playerCharacterFields") as PlayerCharacterFormFieldsComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.playerCharacterIdFromUrl = 0;
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        this.playerCharacterIdFromUrl = this.getIdFromUrl();

        if (this.playerCharacterIdFromUrl > 0) {
            this.configurePageForEditing();
        }
    }

    private getIdFromUrl(): number {
        const urlComponents = window.location.pathname.split("/");
        const idComponent = urlComponents[urlComponents.length - 1].trim();

        if (this.isValidId(idComponent) === false) {
            return 0;
        }

        return Number(idComponent);
    }

    private isValidId(id: string): boolean {
        return !isNaN(Number(id)) && Number.isInteger(Number(id));
    }

    private configurePageForEditing() {
        this.setInitialFormValues();
    }

    private setInitialFormValues() {
        const pc = this.getSelectedPlayerCharacter(this.playerCharacterIdFromUrl);

        this.playerCharacterFormFieldsComponent.setInitialFormValues(pc);
    }

    private getSelectedPlayerCharacter(id: number): PlayerCharacter {
        const request = new GetPlayerCharacterByIdRequest(id);
        const feature = new GetPlayerCharacterByIdFeature(this.unitOfWork);

        return feature.handle(request);
    }

    public handleCancelButtonClick(event: MouseEvent) {
        this.navigateToCharactersPage();
    }

    public async handleFormSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        await this.savePlayerCharacter(formData);
    }

    private async savePlayerCharacter(formData: FormData): Promise<void> {
        const request = new SavePlayerCharacterRequest();
        const feature = new SavePlayerCharacterFeature(this.unitOfWork);

        request.formFields = this.getPlayerCharacterFormFields(formData);
        request.id = this.playerCharacterIdFromUrl;

        const result = await feature.handleAsync(request);

        if (result.isSuccess) {
            this.handleSaveSuccess();
        } else {
            this.handleSaveFailure(result.error);
        }
    }

    private getPlayerCharacterFormFields(formData: FormData): PlayerCharacterFormFieldsDto {
        return PlayerCharacterFormFieldsDto.createFromJson(
            formData.get("playerCharacterFields")?.toString() ?? new PlayerCharacterFormFieldsDto().toJson()
        );
    }

    private handleSaveSuccess() {
        this.navigateToCharactersPage();
    }

    private handleSaveFailure(error: ResultError) {
        EventBus.instance.dispatch(new UiReportableErrorOccurredEvent(error.description, error.details));
    }

    private navigateToCharactersPage() {
        PageRouterService.instance.navigateToPage(PageRouterService.charactersPage);
    }
}

customElements.define("player-character-page", PlayerCharacterComponent);
