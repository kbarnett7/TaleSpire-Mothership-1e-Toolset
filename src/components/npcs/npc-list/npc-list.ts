import html from "./npc-list.html";
import { GetAllNpcsFeature } from "../../../features/npcs/get-all-npcs/get-all-npcs-feature";
import { NpcListItem } from "../../../features/npcs/npc-list-item";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEvent } from "../../../lib/events/app-event";
import { SortNpcsListFeature } from "../../../features/npcs/sort-npcs-list/sort-npcs-list-feature";
import { SortNpcsListRequest } from "../../../features/npcs/sort-npcs-list/sort-npcs-list-request";
import { TableHeader } from "../../../lib/tables/table-header";
import { NpcFilterChangedEvent } from "../../../lib/events/npc-filter-changed-event";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { FilterNpcsListFeature } from "../../../features/npcs/filter-npcs-list/filter-npcs-list-feature";
import { FilterNpcsListRequest } from "../../../features/npcs/filter-npcs-list/filter-npcs-list-request";
import { BaseListComponent } from "../../base-list/base-list-component";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { NpcDisplayDialogComponent } from "../npc-display-dialog/npc-display-dialog";
import { NpcDeletedEvent } from "../../../lib/events/npc-deleted-event";

export class NpcListComponent extends BaseListComponent {
    private npcsList: Array<NpcListItem>;
    private currentFilters: NpcFilterChangedEvent;

    constructor() {
        super(SortNpcsListFeature.fieldId, [
            new TableHeader(SortNpcsListFeature.fieldName, "Name"),
            new TableHeader(SortNpcsListFeature.fieldCombat, "Combat"),
            new TableHeader(SortNpcsListFeature.fieldInstinct, "Instinct"),
            new TableHeader(SortNpcsListFeature.fieldArmorPoints, "Armor Points"),
            new TableHeader(SortNpcsListFeature.fieldWoundsHealth, "Max Wounds (Health)"),
        ]);
        this.npcsList = [];
        this.currentFilters = new NpcFilterChangedEvent("", 0);
    }

    public connectedCallback() {
        this.render(html);

        const feature = new GetAllNpcsFeature(this.unitOfWork);
        this.npcsList = feature.handle(new EmptyRequest());

        this.sortItems();

        this.populateTableHeaderRow();
        this.populateTableRows();

        EventBus.instance.register(NpcFilterChangedEvent.name, this.onNpcFilterChangedEvent);
        EventBus.instance.register(NpcDeletedEvent.name, this.onNpcDeletedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(NpcFilterChangedEvent.name, this.onNpcFilterChangedEvent);
        EventBus.instance.unregister(NpcDeletedEvent.name, this.onNpcDeletedEvent);
    }

    protected override createTableRowsElements(tableBody: HTMLTableSectionElement) {
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

    protected override sortItems() {
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
        const modal = this.shadow.querySelector("#npcDisplayDialog") as NpcDisplayDialogComponent;

        if (!modal) {
            this.dispatchErrorEvent('Modal "npcDisplayDialog" not found.');
            return;
        }

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        modal.setNpc(npcListItem.id);

        modal.openModal();
    }

    private onNpcFilterChangedEvent: AppEventListener = (event: AppEvent) => {
        this.filterNpcs(event as NpcFilterChangedEvent);
    };

    private filterNpcs(event: NpcFilterChangedEvent) {
        this.currentFilters = event;

        const feature = new FilterNpcsListFeature(this.unitOfWork);
        const request = new FilterNpcsListRequest();

        request.search = event.search;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        this.npcsList = result.value ?? [];

        this.sortItems();

        this.populateTableRows(true);
    }

    private onNpcDeletedEvent: AppEventListener = (event: AppEvent) => {
        this.filterNpcs(this.currentFilters);
    };
}

customElements.define("npc-list", NpcListComponent);
