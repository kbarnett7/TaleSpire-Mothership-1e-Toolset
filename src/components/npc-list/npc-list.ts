import html from "./npc-list.html";
import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { GetAllNpcsFeature } from "../../features/npcs/get-all-npcs/get-all-npcs-feature";
import { NpcListItem } from "../../features/npcs/npc-list-item";
import { EmptyRequest } from "../../lib/common/features/empty-request";
import { EventBus } from "../../lib/events/event-bus";
import { AppErrorEvent } from "../../lib/events/app-error-event";
import { EventType } from "../../lib/events/event-type";
import { AppEvent } from "../../lib/events/app-event";
import { ModalDialogComponent } from "../modal-dialog/modal-dialog";
import { NpcFormComponent } from "../npc-form/npc-form";
import { Npc } from "../../features/npcs/npc";
import { GetNpcByIdFeature } from "../../features/npcs/get-npc-by-id/get-npc-by-id-feature";
import { GetNpcByIdRequest } from "../../features/npcs/get-npc-by-id/get-npc-by-id-request";
import { SortNpcsListFeature } from "../../features/npcs/sort-npcs-list/sort-npcs-list-feature";
import { SortState } from "../../lib/sorting/sort-state";
import { SortNpcsListRequest } from "../../features/npcs/sort-npcs-list/sort-npcs-list-request";
import { SortDirection } from "../../lib/sorting/sort-direction";
import { TableHeader } from "../../lib/tables/table-header";
import { NpcFilterChangedEvent } from "../../lib/events/npc-filter-changed-event";
import { AppEventListener } from "../../lib/events/app-event-listener-interface";
import { FilterNpcsListFeature } from "../../features/npcs/filter-npcs-list/filter-npcs-list-feature";
import { FilterNpcsListRequest } from "../../features/npcs/filter-npcs-list/filter-npcs-list-request";
import { BaseListComponent } from "../base-list/base-list-component";

export class NpcListComponent extends BaseListComponent {
    private npcsList: Array<NpcListItem>;

    constructor() {
        super(SortNpcsListFeature.fieldId, [
            new TableHeader(SortNpcsListFeature.fieldName, "Name"),
            new TableHeader(SortNpcsListFeature.fieldCombat, "Combat"),
            new TableHeader(SortNpcsListFeature.fieldInstinct, "Instinct"),
            new TableHeader(SortNpcsListFeature.fieldArmorPoints, "Armor Points"),
            new TableHeader(SortNpcsListFeature.fieldWoundsHealth, "Max Wounds (Health)"),
        ]);
        this.npcsList = [];
    }

    public connectedCallback() {
        this.render(html);

        const feature = new GetAllNpcsFeature(this.unitOfWork);
        this.npcsList = feature.handle(new EmptyRequest());

        this.sortItems();

        this.populateTableHeaderRow();
        this.populateTableRows();

        EventBus.instance.register(NpcFilterChangedEvent.name, this.onNpcFilterChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(NpcFilterChangedEvent.name, this.onNpcFilterChangedEvent);
    }

    protected createTableRowsElements(tableBody: HTMLTableSectionElement) {
        this.npcsList.forEach((item) => {
            tableBody.appendChild(this.createTableRowElement(item));
        });
    }

    private createTableRowElement(npcListItem: NpcListItem): HTMLTableRowElement {
        const row = this.createBaseTableRowElement();

        row.innerHTML = `
                <td class="p-2">${npcListItem.name}</td>
                <td class="p-2">${this.convertNumberFieldToString(npcListItem.combat)}</td>
                <td class="p-2">${this.convertNumberFieldToString(npcListItem.instinct)}</td>
                <td class="p-2">${this.convertNumberFieldToString(npcListItem.armorPoints)}</td>
                <td class="p-2">${this.convertNumberFieldToString(
                    npcListItem.maximumWounds
                )} (${this.convertNumberFieldToString(npcListItem.health)})</td>
            `;

        row.addEventListener("click", (event: MouseEvent) => this.onTableDataRowClick(npcListItem));

        return row;
    }

    private convertNumberFieldToString(value: number): string {
        if (value == 0) {
            return "-";
        }

        return value.toString();
    }

    protected sortItems() {
        this.tableHeaders.forEach((currentHeader) => {
            this.updateSortIcons(currentHeader.field);
        });

        const feature = new SortNpcsListFeature();
        const request = new SortNpcsListRequest();

        request.npcListItems = this.npcsList;
        request.sortState = this.sortState;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        this.npcsList = result.value ?? [];
    }

    public onTableDataRowClick(npcListItem: NpcListItem) {
        const modal = this.shadow.querySelector("#npcModal");

        if (!modal) {
            this.dispatchErrorEvent('Modal "npcModal" not found.');
            return;
        }

        EventBus.instance.dispatch(new AppEvent(EventType.ErrorPanelHide));

        this.populateNpcForm(npcListItem);

        (modal as ModalDialogComponent).openModal();
    }

    private populateNpcForm(npcListItem: NpcListItem) {
        const npcForm = this.shadow.querySelector(`#npcForm`) as NpcFormComponent;
        npcForm.setNpc(this.getSelectedNpc(npcListItem.id));
    }

    private getSelectedNpc(id: number): Npc {
        const feature = new GetNpcByIdFeature(this.unitOfWork);
        const request = new GetNpcByIdRequest(id);

        return feature.handle(request);
    }

    private onNpcFilterChangedEvent: AppEventListener = (event: AppEvent) => {
        this.filterNpcs(event as NpcFilterChangedEvent);
    };

    private filterNpcs(event: NpcFilterChangedEvent) {
        const feature = new FilterNpcsListFeature(this.unitOfWork);
        const request = new FilterNpcsListRequest();

        request.search = event.search;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        EventBus.instance.dispatch(new AppEvent(EventType.ErrorPanelHide));

        this.npcsList = result.value ?? [];

        this.sortItems();

        this.populateTableRows(true);
    }
}

customElements.define("npc-list", NpcListComponent);
