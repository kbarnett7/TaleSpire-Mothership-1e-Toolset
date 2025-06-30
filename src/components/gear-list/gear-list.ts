import html from "./gear-list.html";
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
import { GearEquipmentFormComponent } from "../gear-equipment-form/gear-equipment-form";
import { ModalDialogComponent } from "../modal-dialog/modal-dialog";
import { EquipmentItem } from "../../features/gear/equipment-item";
import { GetGearByIdFeature } from "../../features/gear/get-gear-by-id/get-gear-by-id-feature";
import { GetGearByIdRequest } from "../../features/gear/get-gear-by-id/get-gear-by-id-request";
import { GearItem } from "../../features/gear/gear-item";
import { GearArmorFormComponent } from "../gear-armor-form/gear-armor-form";
import { ArmorItem } from "../../features/gear/armor-item";
import { WeaponItem } from "../../features/gear/weapon-item";
import { GearWeaponFormComponent } from "../gear-weapon-form/gear-weapon-form";
import { AppEventListener } from "../../lib/events/app-event-listener-interface";
import { BaseListComponent } from "../base-list/base-list-component";
import { TableHeader } from "../../lib/tables/table-header";

export class GearListComponent extends BaseListComponent {
    private getAllGearFeature: GetAllGearFeature;
    private gearList: Array<GearListItem> = [];

    constructor() {
        super(SortGearListFeature.fieldId, [
            new TableHeader(SortGearListFeature.fieldItem, "Item"),
            new TableHeader(SortGearListFeature.fieldCost, "Cost"),
            new TableHeader(SortGearListFeature.fieldCategory, "Category"),
            new TableHeader(SortGearListFeature.fieldDescription, "Description"),
        ]);
        this.getAllGearFeature = new GetAllGearFeature(this.unitOfWork);
    }

    public connectedCallback() {
        this.render(html);

        this.gearList = this.getAllGearFeature.handle(new EmptyRequest());

        this.sortItems();

        this.populateTableHeaderRow();
        this.populateTableRows();

        EventBus.instance.register(GearFilterChangedEvent.name, this.onGearCategoryChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearFilterChangedEvent.name, this.onGearCategoryChangedEvent);
    }

    protected populateTableRows(clearOldRows: boolean = false) {
        const gearListContainer = this.shadow.querySelector("#list-container");

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

    private onGearCategoryChangedEvent: AppEventListener = (event: AppEvent) => {
        this.filterGear(event as GearFilterChangedEvent);
    };

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

        this.sortItems();

        this.populateTableRows(true);
    }

    public onTableDataRowClick(gearItem: GearListItem) {
        const modal = this.shadow.querySelector(`#gear${gearItem.category}Modal`);

        if (!modal) {
            this.dispatchErrorEvent(`Modal \"gear${gearItem.category}Modal\" not found.`);
            return;
        }

        EventBus.instance.dispatch(new AppEvent(EventType.ErrorPanelHide));

        this.populateAppropriateGearItemForm(gearItem);

        (modal as ModalDialogComponent).openModal();
    }

    private populateAppropriateGearItemForm(gearItem: GearListItem) {
        if (gearItem.category === ArmorItem.gearCategory) {
            this.setArmorForm(gearItem.id);
        } else if (gearItem.category === EquipmentItem.gearCategory) {
            this.setEquipmentForm(gearItem.id);
        } else if (gearItem.category === WeaponItem.gearCategory) {
            this.setWeaponForm(gearItem.id);
        }
    }

    private setArmorForm(id: number) {
        const armorForm = this.shadow.querySelector(`#gearArmorForm`) as GearArmorFormComponent;
        armorForm.setEquipmentItem(this.getSelectedGearItem(id, ArmorItem.gearCategory) as ArmorItem);
    }

    private setEquipmentForm(id: number) {
        const equipmentForm = this.shadow.querySelector(`#gearEquipmentForm`) as GearEquipmentFormComponent;
        equipmentForm.setEquipmentItem(this.getSelectedGearItem(id, EquipmentItem.gearCategory) as EquipmentItem);
    }

    private setWeaponForm(id: number) {
        const weaponForm = this.shadow.querySelector(`#gearWeaponForm`) as GearWeaponFormComponent;
        weaponForm.setEquipmentItem(this.getSelectedGearItem(id, WeaponItem.gearCategory) as WeaponItem);
    }

    private getSelectedGearItem(id: number, category: string): GearItem {
        const feature = new GetGearByIdFeature(this.unitOfWork);
        const request = new GetGearByIdRequest(id, category);

        return feature.handle(request);
    }

    protected sortItems() {
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
}

customElements.define("gear-list", GearListComponent);
