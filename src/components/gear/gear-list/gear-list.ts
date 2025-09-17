import html from "./gear-list.html";
import { GetAllGearFeature } from "../../../features/gear/get-all-gear/get-all-gear-feature";
import { GearListItem } from "../../../features/gear/gear-list-item";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { EventBus } from "../../../lib/events/event-bus";
import { GearFilterChangedEvent } from "../../../lib/events/gear-filter-changed-event";
import { AppEvent } from "../../../lib/events/app-event";
import { FilterGearListFeature } from "../../../features/gear/filter-gear-list/filter-gear-list-feature";
import { FilterGearListRequest } from "../../../features/gear/filter-gear-list/filter-gear-list-request";
import { SortGearListFeature } from "../../../features/gear/sort-gear-list/sort-gear-list-feature";
import { SortGearListRequest } from "../../../features/gear/sort-gear-list/sort-gear-list-request";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { BaseListComponent } from "../../base-list/base-list-component";
import { TableHeader } from "../../../lib/tables/table-header";
import { Source } from "../../../features/sources/source";
import { GearItemDisplayDialogComponent } from "../gear-item-display-dialog/gear-item-display-dialog";
import { GearItemDeletedEvent } from "../../../lib/events/gear-item-deleted-event";
import { GearItem } from "../../../features/gear/gear-item";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { SourcesService } from "../../../features/sources/sources-service";

export class GearListComponent extends BaseListComponent {
    private gearList: Array<GearListItem> = [];
    private currentFilters: GearFilterChangedEvent;

    constructor() {
        super(SortGearListFeature.fieldId, [
            new TableHeader(SortGearListFeature.fieldItem, "Item"),
            new TableHeader(SortGearListFeature.fieldCost, "Cost"),
            new TableHeader(SortGearListFeature.fieldCategory, "Category"),
            new TableHeader(SortGearListFeature.fieldDescription, "Description"),
        ]);
        this.currentFilters = new GearFilterChangedEvent(GearItem.gearCategory, "", 0);
    }

    public connectedCallback() {
        this.render(html);

        const feature = new GetAllGearFeature(this.unitOfWork);
        this.gearList = feature.handle(new EmptyRequest());

        this.sortItems();

        this.populateTableHeaderRow();
        this.populateTableRows();

        EventBus.instance.register(GearFilterChangedEvent.name, this.onGearFilterChangedEvent);
        EventBus.instance.register(GearItemDeletedEvent.name, this.onGearItemDeletedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearFilterChangedEvent.name, this.onGearFilterChangedEvent);
        EventBus.instance.unregister(GearItemDeletedEvent.name, this.onGearItemDeletedEvent);
    }

    protected override createTableRowsElements(tableBody: HTMLTableSectionElement) {
        this.gearList.forEach((item) => {
            tableBody.appendChild(this.createTableRowElement(item));
        });
    }

    private createTableRowElement(gearItem: GearListItem): HTMLTableRowElement {
        const row = this.createBaseTableRowElement();

        row.innerHTML = `
            <td class="p-2">${this.getNameTableDataInnerHtml(gearItem)}</td>
            <td class="p-2">${gearItem.abbreviatedCost}</td>
            <td class="p-2">${gearItem.category}</td>
            <td class="p-2 truncate max-w-50">${gearItem.description}</td>
        `;

        row.addEventListener("click", (event: MouseEvent) => this.onTableDataRowClick(gearItem));

        return row;
    }

    private getNameTableDataInnerHtml(gearItem: GearListItem): string {
        let nameInnerHtml = gearItem.name;

        if (gearItem.sourceId === SourcesService.instance.getCustomItemSourceId(this.unitOfWork)) {
            nameInnerHtml = `${gearItem.name} <sup>(C)</sup>`;
        }

        return nameInnerHtml;
    }

    private onGearFilterChangedEvent: AppEventListener = (event: AppEvent) => {
        this.filterGear(event as GearFilterChangedEvent);
    };

    private filterGear(event: GearFilterChangedEvent) {
        this.currentFilters = event;

        const feature = new FilterGearListFeature(this.unitOfWork);
        const request = new FilterGearListRequest();

        request.category = event.category;
        request.search = event.search;
        request.sourceId = event.sourceId;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        this.gearList = result.value ?? [];

        this.sortItems();

        this.populateTableRows(true);
    }

    public onTableDataRowClick(gearItem: GearListItem) {
        const modal = this.shadow.querySelector(`#gearItemDisplayDialog`) as GearItemDisplayDialogComponent;

        if (!modal) {
            this.dispatchErrorEvent(`Modal \"gearItemDisplayDialog\" not found.`);
            return;
        }

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        modal.setGearItem(gearItem.id, gearItem.category);

        modal.openModal();
    }

    protected override sortItems() {
        this.tableHeaders.forEach((currentHeader) => {
            this.updateSortIcons(currentHeader.field);
        });

        const feature = new SortGearListFeature();
        const request = new SortGearListRequest();

        request.gearListItems = this.gearList;
        request.sortState = this.sortState;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        this.gearList = result.value ?? [];
    }

    private onGearItemDeletedEvent: AppEventListener = (event: AppEvent) => {
        this.filterGear(this.currentFilters);
    };
}

customElements.define("gear-list", GearListComponent);
