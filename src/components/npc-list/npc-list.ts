import html from "./npc-list.html";
import { BaseComponent } from "../base.component";
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

export class NpcListComponent extends BaseComponent {
    private getAllNpcsFeature: GetAllNpcsFeature;
    private npcsList: Array<NpcListItem>;
    private tableHeaders: TableHeader[] = [
        new TableHeader(SortNpcsListFeature.fieldName, "Name"),
        new TableHeader(SortNpcsListFeature.fieldCombat, "Combat"),
        new TableHeader(SortNpcsListFeature.fieldInstinct, "Instinct"),
        new TableHeader(SortNpcsListFeature.fieldArmorPoints, "Armor Points"),
        new TableHeader(SortNpcsListFeature.fieldWoundsHealth, "Max Wounds (Health)"),
    ];
    private sortState: SortState = new SortState(SortNpcsListFeature.fieldId);
    private unitOfWork: IUnitOfWork;

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.getAllNpcsFeature = new GetAllNpcsFeature(this.unitOfWork);
        this.npcsList = [];
    }

    public connectedCallback() {
        this.render(html);

        this.npcsList = this.getAllNpcsFeature.handle(new EmptyRequest());

        this.sortNpcs();

        this.populateTableHeaderRow();
        this.populateTableRows();

        EventBus.instance.register(NpcFilterChangedEvent.name, this.onNpcCategoryChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(NpcFilterChangedEvent.name, this.onNpcCategoryChangedEvent);
    }

    private populateTableHeaderRow() {
        const npcListContainer = this.shadow.querySelector("#npc-list-container");

        if (!npcListContainer) return;

        const tableHeader = npcListContainer.querySelector("thead");

        if (!tableHeader) return;

        tableHeader.appendChild(this.createTableHeaderRowElement());
    }

    private createTableHeaderRowElement(): HTMLTableRowElement {
        const row = document.createElement("tr");

        this.tableHeaders.forEach((header) => {
            row.appendChild(this.createTableHeaderElement(header));
        });

        return row;
    }

    private createTableHeaderElement(header: TableHeader): HTMLTableCellElement {
        const tableHeaderElement = document.createElement("th");

        tableHeaderElement.id = `header${header.field}`;
        tableHeaderElement.className = "uppercase p-2 cursor-pointer";
        tableHeaderElement.onclick = () => this.onTableHeaderClick(header.field);
        tableHeaderElement.appendChild(this.createHeaderDivElement(header));

        return tableHeaderElement;
    }

    private createHeaderDivElement(header: TableHeader): HTMLDivElement {
        const headerDiv = document.createElement("div");

        headerDiv.className = "flex justify-between";
        headerDiv.innerHTML = `
            <div>${header.displayName}</div>
            <div id="${header.field}SortIcon"></div>
        `;

        return headerDiv;
    }

    private populateTableRows(clearOldRows: boolean = false) {
        const npcListContainer = this.shadow.querySelector("#npc-list-container");

        if (!npcListContainer) return;

        const tableBody = npcListContainer.querySelector("tbody");

        if (!tableBody) return;

        if (clearOldRows && tableBody.hasChildNodes()) {
            tableBody.replaceChildren();
        }

        this.npcsList.forEach((item) => {
            tableBody.appendChild(this.createTableRowElement(item));
        });
    }

    private createTableRowElement(npcListItem: NpcListItem): HTMLTableRowElement {
        const row = document.createElement("tr");

        row.className = "border-2 border-y-gray-300 cursor-pointer hover:bg-gray-300";

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

    public onTableHeaderClick(header: string) {
        this.sortState.set(header);
        this.sortNpcs();
        this.populateTableRows(true);
    }

    private sortNpcs() {
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

    private updateSortIcons(currentHeader: string) {
        const sortIcon = this.shadow.querySelector(`#${currentHeader}SortIcon`);

        if (!sortIcon) return;

        if (currentHeader !== this.sortState.field) {
            sortIcon.className = "";
            return;
        }

        if (this.sortState.direction === SortDirection.Ascending) {
            sortIcon.className = "icon-chevron icon-chevron-up";
        } else if (this.sortState.direction === SortDirection.Descending) {
            sortIcon.className = "icon-chevron icon-chevron-down";
        } else {
            sortIcon.className = "";
        }
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

    private onNpcCategoryChangedEvent: AppEventListener = (event: AppEvent) => {
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

        this.sortNpcs();

        this.populateTableRows(true);
    }

    private dispatchErrorEvent(error: string) {
        EventBus.instance.dispatch(new AppErrorEvent(EventType.ErrorPanelShow, error));
    }
}

customElements.define("npc-list", NpcListComponent);
