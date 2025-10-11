import html from "./npc.html";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { BasePageComponent } from "../base-page.component";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { NpcFormFieldsComponent } from "../../npcs/npc-form-fields/npc-form-fields";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { EventBus } from "../../../lib/events/event-bus";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { SaveCustomNpcRequest } from "../../../features/npcs/save-custom-npc/save-custom-npc-request";
import { SaveCustomNpcFeature } from "../../../features/npcs/save-custom-npc/save-custom-npc-feature";
import { NpcFormFieldsDto } from "../../../features/npcs/npc-form-fields-dto";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { UiReportableErrorOccurredEvent } from "../../../lib/events/ui-reportable-error-occurred-event";

export class NpcComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private npcIdFromUrl: number;

    private get npcFormFieldsComponent(): NpcFormFieldsComponent {
        return this.shadow.querySelector("#npcFields") as NpcFormFieldsComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.npcIdFromUrl = 0;
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        this.npcIdFromUrl = this.getIdFromUrl();

        if (this.npcIdFromUrl > 0) {
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
        // TODO in future edit NPC story...
        //      - Implement this method
        //      - BaseDoubleInputRowsTableComponent's _nextRowId will need to be set to attacks/specialAbilities.length + 1
        //      - Change effect & description input fields to textarea fields.
    }

    public handleCancelButtonClick(event: MouseEvent) {
        this.navigateToNpcsPage();
    }

    public async handleFormSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        await this.saveNpc(formData);
    }

    private async saveNpc(formData: FormData): Promise<void> {
        const request = new SaveCustomNpcRequest();
        const feature = new SaveCustomNpcFeature(this.unitOfWork);

        request.formFields = this.getNpcFormFields(formData);
        request.id = this.npcIdFromUrl;

        const result = await feature.handleAsync(request);

        if (result.isSuccess) {
            this.handleSaveSuccess();
        } else {
            this.handleSaveFailure(result.error);
        }
    }

    private getNpcFormFields(formData: FormData): NpcFormFieldsDto {
        return NpcFormFieldsDto.createFromJson(
            formData.get("npcFields")?.toString() ?? new NpcFormFieldsDto().toJson()
        );
    }

    private handleSaveSuccess() {
        this.navigateToNpcsPage();
    }

    private handleSaveFailure(error: ResultError) {
        EventBus.instance.dispatch(new UiReportableErrorOccurredEvent(error.description, error.details));
    }

    private navigateToNpcsPage() {
        PageRouterService.instance.navigateToPage(PageRouterService.npcsPage);
    }
}

customElements.define("npc-page", NpcComponent);
