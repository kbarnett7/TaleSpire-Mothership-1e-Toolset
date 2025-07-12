import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { AppErrorEvent } from "../../lib/events/app-error-event";
import { EventBus } from "../../lib/events/event-bus";
import { EventType } from "../../lib/events/event-type";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { SortDirection } from "../../lib/sorting/sort-direction";
import { SortState } from "../../lib/sorting/sort-state";
import { TableHeader } from "../../lib/tables/table-header";
import { BaseComponent } from "../base.component";

export abstract class BaseListComponent extends BaseComponent {
    protected unitOfWork: IUnitOfWork;
    protected readonly tableHeaders: TableHeader[];
    protected sortState: SortState;

    constructor(defaultSortField: string, tableHeaders: TableHeader[]) {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.sortState = new SortState(defaultSortField);
        this.tableHeaders = tableHeaders;
    }

    protected populateTableHeaderRow() {
        const npcListContainer = this.shadow.querySelector("#list-container");

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

    private onTableHeaderClick(header: string) {
        this.sortState.set(header);
        this.sortItems();
        this.populateTableRows(true);
    }

    protected populateTableRows(clearOldRows: boolean = false) {
        const gearListContainer = this.shadow.querySelector("#list-container");

        if (!gearListContainer) return;

        const tableBody = gearListContainer.querySelector("tbody");

        if (!tableBody) return;

        if (clearOldRows && tableBody.hasChildNodes()) {
            tableBody.replaceChildren();
        }

        this.createTableRowsElements(tableBody);
    }

    protected createBaseTableRowElement(): HTMLTableRowElement {
        const row = document.createElement("tr");

        row.className = "border-2 border-y-gray-300 cursor-pointer hover:bg-gray-300";

        return row;
    }

    protected updateSortIcons(currentHeader: string) {
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

    protected dispatchErrorEvent(error: string) {
        EventBus.instance.dispatch(new AppErrorEvent(EventType.ErrorPanelShow, error));
    }

    protected abstract sortItems(): void;
    protected abstract createTableRowsElements(tableBody: HTMLTableSectionElement): void;
}
