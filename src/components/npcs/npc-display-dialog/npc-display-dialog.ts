import html from "./npc-display-dialog.html";
import { BaseComponent } from "../../base.component";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { EventBus } from "../../../lib/events/event-bus";
import { ModalDialogComponent } from "../../modal-dialog/modal-dialog";
import { UiReportableErrorOccurredEvent } from "../../../lib/events/ui-reportable-error-occurred-event";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { SourcesService } from "../../../features/sources/sources-service";
import { NpcDisplayComponent } from "../npc-display/npc-display";
import { Npc } from "../../../features/npcs/npc";
import { GetNpcByIdRequest } from "../../../features/npcs/get-npc-by-id/get-npc-by-id-request";
import { GetNpcByIdFeature } from "../../../features/npcs/get-npc-by-id/get-npc-by-id-feature";

export class NpcDisplayDialogComponent extends BaseComponent {
    protected unitOfWork: IUnitOfWork;

    private _npc: Npc;
    private _isCustomNpc: boolean;

    protected get npcDisplayElement(): NpcDisplayComponent {
        return this.shadow.querySelector(`#npcDisplay`) as NpcDisplayComponent;
    }

    protected get npcModalElement(): ModalDialogComponent {
        return this.shadow.querySelector("#npcModal") as ModalDialogComponent;
    }

    protected get editNpcButton(): HTMLButtonElement {
        return this.shadow.querySelector("#editNpcButton") as HTMLButtonElement;
    }

    protected get deleteNpcButton(): HTMLButtonElement {
        return this.shadow.querySelector("#deleteNpcButton") as HTMLButtonElement;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this._npc = new Npc();
        this._isCustomNpc = false;
    }

    public connectedCallback() {
        this.render(html);
    }

    public openModal() {
        const modal = this.npcModalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.openModal();
    }

    public closeModal() {
        const modal = this.npcModalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.closeModal();
    }

    private dispatchModalNotFoundEvent() {
        EventBus.instance.dispatch(new UiReportableErrorOccurredEvent('Modal "npcDisplayDialog" not found.'));
    }

    public setNpc(id: number) {
        this._npc = this.getSelectedNpc(id);
        this._isCustomNpc = this.isCustomNpc();

        this.npcDisplayElement.setNpc(this._npc);
        this.setEditButtonVisibility();
        this.setDeleteButtonVisibility();
    }

    private getSelectedNpc(id: number): Npc {
        const request = new GetNpcByIdRequest(id);
        const feature = new GetNpcByIdFeature(this.unitOfWork);

        return feature.handle(request);
    }

    private isCustomNpc(): boolean {
        return this._npc.sourceId === SourcesService.instance.getCustomItemSourceId(this.unitOfWork);
    }

    private setEditButtonVisibility() {
        if (this._isCustomNpc) {
            this.editNpcButton.classList.remove("hidden");
            this.editNpcButton.classList.add("inline-flex");
        } else {
            this.editNpcButton.classList.add("hidden");
            this.editNpcButton.classList.remove("inline-flex");
        }
    }

    private setDeleteButtonVisibility() {
        if (this._isCustomNpc) {
            this.deleteNpcButton.classList.remove("hidden");
            this.deleteNpcButton.classList.add("inline-flex");
        } else {
            this.deleteNpcButton.classList.add("hidden");
            this.deleteNpcButton.classList.remove("inline-flex");
        }
    }

    public onEditButtonClick(event: MouseEvent) {
        PageRouterService.instance.navigateToPage(PageRouterService.npcPage, this._npc.id.toString());
    }

    public async onDeleteButtonClick(event: MouseEvent): Promise<void> {
        // const request = new DeleteCustomNpcRequest();
        // const feature = new DeleteCustomNpcFeature(this.unitOfWork);
        // request.id = this._npc.id;
        // const result = await feature.handleAsync(request);
        // if (result.isFailure) {
        //     EventBus.instance.dispatch(
        //         new UiReportableErrorOccurredEvent(result.error.description, result.error.details)
        //     );
        // } else {
        //     EventBus.instance.dispatch(new UiReportableErrorClearedEvent());
        //     EventBus.instance.dispatch(new GearItemDeletedEvent());
        // }
        // this.closeModal();
    }

    public onCloseModal(event: MouseEvent) {
        this.closeModal();
    }
}

customElements.define("npc-display-dialog", NpcDisplayDialogComponent);
