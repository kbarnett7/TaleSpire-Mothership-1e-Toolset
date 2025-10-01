import html from "./npc.html";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { BasePageComponent } from "../base-page.component";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { NpcFormFieldsComponent } from "../../npcs/npc-form-fields/npc-form-fields";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { EventBus } from "../../../lib/events/event-bus";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";

export class NpcComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private gearItemIdFromUrl: number;

    private get npcFormFieldsComponent(): NpcFormFieldsComponent {
        return this.shadow.querySelector("#npcFields") as NpcFormFieldsComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.gearItemIdFromUrl = 0;
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        this.gearItemIdFromUrl = this.getIdFromUrl();

        if (this.gearItemIdFromUrl > 0) {
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

    private configurePageForEditing() {}

    public handleCancelButtonClick(event: MouseEvent) {
        this.navigateToNpcsPage();
    }

    public async handleFormSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        //await this.saveGearItem(formData);
        this.handleSaveSuccess();
    }

    private handleSaveSuccess() {
        this.navigateToNpcsPage();
    }

    private navigateToNpcsPage() {
        PageRouterService.instance.navigateToPage(PageRouterService.npcsPage);
    }
}

customElements.define("npc-page", NpcComponent);
