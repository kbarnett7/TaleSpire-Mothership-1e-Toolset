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

export class GearListComponent extends BaseComponent {
    private getAllGearFeature: GetAllGearFeature;
    private gearList: Array<GearListItem> = [];
    private unitOfWork: IUnitOfWork;

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.getAllGearFeature = new GetAllGearFeature(this.unitOfWork);
    }

    public connectedCallback() {
        this.render(html);

        this.gearList = this.getAllGearFeature.handle(new EmptyRequest());

        this.populateGearTable();

        this.registerGearCategoryChangedEvent();
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

        row.className = "border-2 border-y-gray-300";

        row.innerHTML = `
            <td class="p-2">${gearItem.name}</td>
            <td class="p-2">${gearItem.abbreviatedCost}</td>
            <td class="p-2">${gearItem.category}</td>
            <td class="p-2">${gearItem.description}</td>
        `;

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
            EventBus.instance.dispatch(new AppErrorEvent(EventType.ErrorPanelShow, result.error.description));
            return;
        }

        EventBus.instance.dispatch(new AppEvent(EventType.ErrorPanelHide));

        this.gearList = result.value ?? [];

        this.populateGearTable(true);
    }
}

customElements.define("gear-list", GearListComponent);
