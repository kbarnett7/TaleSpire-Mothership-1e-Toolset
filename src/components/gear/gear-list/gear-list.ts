import html from "./gear-list.html";
import { GetAllGearFeature } from "../../../features/gear/get-all-gear/get-all-gear-feature";
import { GearListItem } from "../../../features/gear/gear-list-item";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { EventBus } from "../../../lib/events/event-bus";
import { GearFilterChangedEvent } from "../../../lib/events/gear-filter-changed-event";
import { AppEvent } from "../../../lib/events/app-event";
import { FilterGearListFeature } from "../../../features/gear/filter-gear-list/filter-gear-list-feature";
import { FilterGearListRequest } from "../../../features/gear/filter-gear-list/filter-gear-list-request";
import { EventType } from "../../../lib/events/event-type";
import { SortGearListFeature } from "../../../features/gear/sort-gear-list/sort-gear-list-feature";
import { SortGearListRequest } from "../../../features/gear/sort-gear-list/sort-gear-list-request";
import { GearEquipmentDisplayComponent } from "../gear-equipment-display/gear-equipment-display";
import { ModalDialogComponent } from "../../modal-dialog/modal-dialog";
import { EquipmentItem } from "../../../features/gear/equipment-item";
import { GetGearByIdFeature } from "../../../features/gear/get-gear-by-id/get-gear-by-id-feature";
import { GetGearByIdRequest } from "../../../features/gear/get-gear-by-id/get-gear-by-id-request";
import { GearItem } from "../../../features/gear/gear-item";
import { GearArmorDisplayComponent } from "../gear-armor-display/gear-armor-display";
import { ArmorItem } from "../../../features/gear/armor-item";
import { WeaponItem } from "../../../features/gear/weapon-item";
import { GearWeaponDisplayComponent } from "../gear-weapon-display/gear-weapon-display";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { BaseListComponent } from "../../base-list/base-list-component";
import { TableHeader } from "../../../lib/tables/table-header";

export class GearListComponent extends BaseListComponent {
    private gearList: Array<GearListItem> = [];

    constructor() {
        super(SortGearListFeature.fieldId, [
            new TableHeader(SortGearListFeature.fieldItem, "Item"),
            new TableHeader(SortGearListFeature.fieldCost, "Cost"),
            new TableHeader(SortGearListFeature.fieldCategory, "Category"),
            new TableHeader(SortGearListFeature.fieldDescription, "Description"),
        ]);
    }

    public connectedCallback() {
        this.render(html);

        const feature = new GetAllGearFeature(this.unitOfWork);
        this.gearList = feature.handle(new EmptyRequest());

        this.sortItems();

        this.populateTableHeaderRow();
        this.populateTableRows();

        EventBus.instance.register(GearFilterChangedEvent.name, this.onGearFilterChangedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearFilterChangedEvent.name, this.onGearFilterChangedEvent);
    }

    protected createTableRowsElements(tableBody: HTMLTableSectionElement) {
        this.gearList.forEach((item) => {
            tableBody.appendChild(this.createTableRowElement(item));
        });
    }

    private createTableRowElement(gearItem: GearListItem): HTMLTableRowElement {
        const row = this.createBaseTableRowElement();

        row.innerHTML = `
            <td class="p-2">${gearItem.name}</td>
            <td class="p-2">${gearItem.abbreviatedCost}</td>
            <td class="p-2">${gearItem.category}</td>
            <td class="p-2 truncate max-w-50">${gearItem.description}</td>
        `;

        row.addEventListener("click", (event: MouseEvent) => this.onTableDataRowClick(gearItem));

        return row;
    }

    private onGearFilterChangedEvent: AppEventListener = (event: AppEvent) => {
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

        this.populateAppropriateGearItemDisplay(gearItem);

        (modal as ModalDialogComponent).openModal();
    }

    private populateAppropriateGearItemDisplay(gearItem: GearListItem) {
        if (gearItem.category === ArmorItem.gearCategory) {
            this.setArmorDisplay(gearItem.id);
        } else if (gearItem.category === EquipmentItem.gearCategory) {
            this.setEquipmentDisplay(gearItem.id);
        } else if (gearItem.category === WeaponItem.gearCategory) {
            this.setWeaponDisplay(gearItem.id);
        }
    }

    private setArmorDisplay(id: number) {
        const armorDisplay = this.shadow.querySelector(`#gearArmorDisplay`) as GearArmorDisplayComponent;
        armorDisplay.setEquipmentItem(this.getSelectedGearItem(id, ArmorItem.gearCategory) as ArmorItem);
    }

    private setEquipmentDisplay(id: number) {
        const equipmentDisplay = this.shadow.querySelector(`#gearEquipmentDisplay`) as GearEquipmentDisplayComponent;
        equipmentDisplay.setEquipmentItem(this.getSelectedGearItem(id, EquipmentItem.gearCategory) as EquipmentItem);
    }

    private setWeaponDisplay(id: number) {
        const weaponDisplay = this.shadow.querySelector(`#gearWeaponDisplay`) as GearWeaponDisplayComponent;
        weaponDisplay.setEquipmentItem(this.getSelectedGearItem(id, WeaponItem.gearCategory) as WeaponItem);
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
