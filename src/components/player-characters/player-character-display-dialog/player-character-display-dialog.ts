import html from "./player-character-display-dialog.html";
import { BaseComponent } from "../../base.component";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { EventBus } from "../../../lib/events/event-bus";
import { ModalDialogComponent } from "../../modal-dialog/modal-dialog";
import { UiReportableErrorOccurredEvent } from "../../../lib/events/ui-reportable-error-occurred-event";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { PlayerCharacterDisplayComponent } from "../player-character-display/player-character-display";
import { PlayerCharacter } from "../../../features/player-characters/player-character";
import { GetPlayerCharacterByIdRequest } from "../../../features/player-characters/get-player-character-by-id/get-player-character-by-id-request";
import { GetPlayerCharacterByIdFeature } from "../../../features/player-characters/get-player-character-by-id/get-player-character-by-id-feature";
import { ConfirmationDialogComponent } from "../../confirmation-dialog/confirmation-dialog";
import { DeletePlayerCharacterRequest } from "../../../features/player-characters/delete-player-character/delete-player-character-request";
import { DeletePlayerCharacterFeature } from "../../../features/player-characters/delete-player-character/delete-player-character-feature";
import { PlayerCharacterDeletedEvent } from "../../../lib/events/player-character-deleted-event";

export class PlayerCharacterDisplayDialogComponent extends BaseComponent {
    protected unitOfWork: IUnitOfWork;

    private _playerCharacter: PlayerCharacter;

    protected get playerCharacterDisplayElement(): PlayerCharacterDisplayComponent {
        return this.shadow.querySelector("#playerCharacterDisplay") as PlayerCharacterDisplayComponent;
    }

    protected get playerCharacterModalElement(): ModalDialogComponent {
        return this.shadow.querySelector("#playerCharacterModal") as ModalDialogComponent;
    }

    protected get deleteConfirmationDialogElement(): ConfirmationDialogComponent {
        return this.shadow.querySelector("#deleteConfirmationDialog") as ConfirmationDialogComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this._playerCharacter = new PlayerCharacter();
    }

    public connectedCallback() {
        this.render(html);
        this.configureDeleteConfirmationModal();
    }

    private configureDeleteConfirmationModal() {
        this.deleteConfirmationDialogElement.onConfirmCallback = this.onDeletePlayerCharacterConfirmation;
    }

    public openModal() {
        const modal = this.playerCharacterModalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.openModal();
    }

    public closeModal() {
        const modal = this.playerCharacterModalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.closeModal();
    }

    private dispatchModalNotFoundEvent() {
        EventBus.instance.dispatch(new UiReportableErrorOccurredEvent('Modal "playerCharacterModal" not found.'));
    }

    public setPlayerCharacter(id: number) {
        this._playerCharacter = this.getSelectedPlayerCharacter(id);
        this.playerCharacterDisplayElement.setPlayerCharacter(this._playerCharacter);
    }

    private getSelectedPlayerCharacter(id: number): PlayerCharacter {
        const request = new GetPlayerCharacterByIdRequest(id);
        const feature = new GetPlayerCharacterByIdFeature(this.unitOfWork);

        return feature.handle(request);
    }

    public onEditButtonClick(event: MouseEvent) {
        PageRouterService.instance.navigateToPage(
            PageRouterService.playerCharacterPage,
            this._playerCharacter.id.toString(),
        );
    }

    public async onDeleteButtonClick(event: MouseEvent): Promise<void> {
        this.deleteConfirmationDialogElement.openModal();
    }

    public onDeletePlayerCharacterConfirmation = async () => {
        const request = new DeletePlayerCharacterRequest();
        const feature = new DeletePlayerCharacterFeature(this.unitOfWork);

        request.id = this._playerCharacter.id;

        const result = await feature.handleAsync(request);

        if (result.isFailure) {
            EventBus.instance.dispatch(
                new UiReportableErrorOccurredEvent(result.error.description, result.error.details),
            );
        } else {
            EventBus.instance.dispatch(new UiReportableErrorClearedEvent());
            EventBus.instance.dispatch(new PlayerCharacterDeletedEvent());
        }

        this.closeModal();
    };

    public onCloseModal(event: MouseEvent) {
        this.closeModal();
    }
}

customElements.define("player-character-display-dialog", PlayerCharacterDisplayDialogComponent);
