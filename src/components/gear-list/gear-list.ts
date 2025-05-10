import html from "./gear-list.html";
import { BaseComponent } from "../base.component";
import { GetAllGearFeature } from "../../features/gear/get-all-gear/get-all-gear-feature";
import { GearListItem } from "../../features/gear/gear-list-item";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { EmptyRequest } from "../../lib/common/features/empty-request";
import { EventBus } from "../../lib/events/event-bus";
import { GearFilterChangedEvent } from "../../lib/events/gear-filter-changed-event";
import { AppEvent } from "../../lib/events/app-event";
import { FilterGearListFeature } from "../../features/gear/filter-gear-list/filter-gear-list-feature";
import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { FilterGearListRequest } from "../../features/gear/filter-gear-list/filter-gear-list-request";
import { AppErrorEvent } from "../../lib/events/app-error-event";
import { EventType } from "../../lib/events/event-type";
import { SortState } from "../../lib/sorting/sort-state";
import { SortDirection } from "../../lib/sorting/sort-direction";
import { SortGearListFeature } from "../../features/gear/sort-gear-list/sort-gear-list-feature";
import { SortGearListRequest } from "../../features/gear/sort-gear-list/sort-gear-list-request";
import { AppLogger } from "../../lib/logging/app-logger";
import { OpenGearModalEvent } from "../../lib/events/open-gear-modal-event";
import { SelectedGearItem } from "../../features/gear/selected-gear-item";
import { GearEquipmentForm } from "../gear-equipment-form/gear-equipment-form";

export class GearListComponent extends BaseComponent {
    private getAllGearFeature: GetAllGearFeature;
    private gearList: Array<GearListItem> = [];
    private tableHeaders: string[] = [
        SortGearListFeature.fieldItem,
        SortGearListFeature.fieldCost,
        SortGearListFeature.fieldCategory,
        SortGearListFeature.fieldDescription,
    ];
    private sortState: SortState = new SortState(SortGearListFeature.fieldId);
    private selectedGearItem: SelectedGearItem;
    private unitOfWork: IUnitOfWork;

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.getAllGearFeature = new GetAllGearFeature(this.unitOfWork);
        this.selectedGearItem = new SelectedGearItem();
    }

    public connectedCallback() {
        this.render(html);

        this.gearList = this.getAllGearFeature.handle(new EmptyRequest());

        this.sortGear();

        this.populateTableHeaderRow();
        this.populateGearTable();

        this.registerGearCategoryChangedEvent();
    }

    private populateTableHeaderRow() {
        const gearListContainer = this.shadow.querySelector("#gear-list-container");

        if (!gearListContainer) return;

        const tableHeader = gearListContainer.querySelector("thead");

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

    private createTableHeaderElement(header: string): HTMLTableCellElement {
        const tableHeaderElement = document.createElement("th");

        tableHeaderElement.id = `header${header}`;
        tableHeaderElement.className = "uppercase p-2 cursor-pointer";
        tableHeaderElement.onclick = () => this.onTableHeaderClick(header);
        tableHeaderElement.appendChild(this.createHeaderDivElement(header));

        return tableHeaderElement;
    }

    private createHeaderDivElement(header: string): HTMLDivElement {
        const headerDiv = document.createElement("div");

        headerDiv.className = "flex justify-between";
        headerDiv.innerHTML = `
            <div>${header}</div>
            <div id="${header}SortIcon"></div>
        `;

        return headerDiv;
    }

    private populateGearTable(clearOldRows: boolean = false) {
        const gearListContainer = this.shadow.querySelector("#gear-list-container");

        if (!gearListContainer) return;

        const tableBody = gearListContainer.querySelector("tbody");

        if (!tableBody) return;

        if (clearOldRows && tableBody.hasChildNodes()) {
            tableBody.replaceChildren();
        }

        this.gearList.forEach((item) => {
            tableBody.appendChild(this.createTableRowElement(item));
        });
    }

    private createTableRowElement(gearItem: GearListItem): HTMLTableRowElement {
        const row = document.createElement("tr");

        row.className = "border-2 border-y-gray-300 cursor-pointer hover:bg-gray-300";

        row.innerHTML = `
            <td class="p-2">${gearItem.name}</td>
            <td class="p-2">${gearItem.abbreviatedCost}</td>
            <td class="p-2">${gearItem.category}</td>
            <td class="p-2 truncate max-w-50">${gearItem.description}</td>
        `;

        row.addEventListener("click", (event: MouseEvent) => this.onTableDataRowClick(gearItem));

        return row;
    }

    private registerGearCategoryChangedEvent() {
        EventBus.instance.register(GearFilterChangedEvent.name, (event: AppEvent) => {
            this.filterGear(event as GearFilterChangedEvent);
        });
    }

    private filterGear(event: GearFilterChangedEvent) {
        const feature = new FilterGearListFeature(this.unitOfWork);
        const request = new FilterGearListRequest();

        request.category = event.category;
        request.search = event.search;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        EventBus.instance.dispatch(new AppEvent(EventType.ErrorPanelHide));

        this.gearList = result.value ?? [];

        this.sortGear();

        this.populateGearTable(true);
    }

    public onTableDataRowClick(gearItem: GearListItem) {
        EventBus.instance.dispatch(new OpenGearModalEvent(gearItem.id, gearItem.category));

        this.selectedGearItem = new SelectedGearItem(gearItem.id, gearItem.category);

        const equipmentForm = this.shadow.querySelector("#gearEquipmentForm") as GearEquipmentForm;

        // Approach 1: set attribute and have the component listen for change
        //equipmentForm.setAttribute("selected-gear-item", JSON.stringify(this.selectedGearItem));

        // Approach 2: directly call a public method of the component
        equipmentForm.onGearEquipmentItemChange(this.selectedGearItem);
    }

    public onTableHeaderClick(header: string) {
        this.sortState.set(header);
        this.sortGear();
        this.populateGearTable(true);
    }

    private sortGear() {
        this.tableHeaders.forEach((currentHeader) => {
            this.updateSortIcons(currentHeader);
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

    private dispatchErrorEvent(error: string) {
        EventBus.instance.dispatch(new AppErrorEvent(EventType.ErrorPanelShow, error));
    }
}

customElements.define("gear-list", GearListComponent);
