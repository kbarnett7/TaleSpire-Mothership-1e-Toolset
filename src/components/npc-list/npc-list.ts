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

export class NpcListComponent extends BaseComponent {
    // TODO: Move fields to Sort Feature class once that is created
    static fieldId: string = "Id";
    static fieldName: string = "Name";
    static fieldCombat: string = "Combat";
    static fieldInstinct: string = "Instinct";
    static fieldArmorPoints: string = "Armor Points";
    static fieldWoundsHealth: string = "Max Wounds (Health)";

    private getAllNpcsFeature: GetAllNpcsFeature;
    private npcsList: Array<NpcListItem>;
    private tableHeaders: string[] = [
        NpcListComponent.fieldName,
        NpcListComponent.fieldCombat,
        NpcListComponent.fieldInstinct,
        NpcListComponent.fieldArmorPoints,
        NpcListComponent.fieldWoundsHealth,
    ];
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

        this.populateTableHeaderRow();
        this.populateTableRows();
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
        // this.sortState.set(header);
        // this.sortGear();
        // this.populateGearTable(true);
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

    private dispatchErrorEvent(error: string) {
        EventBus.instance.dispatch(new AppErrorEvent(EventType.ErrorPanelShow, error));
    }
}

customElements.define("npc-list", NpcListComponent);
