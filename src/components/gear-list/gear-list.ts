import html from "./gear-list.html";
import { BaseComponent } from "../base.component";
import { GetAllGearFeature } from "../../features/gear/get-all-gear/get-all-gear-feature";
import { GearListItem } from "../../features/gear/gear-list-item";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { EmptyRequest } from "../../lib/common/features/empty-request";
import { EventBus } from "../../lib/events/event-bus";
import { GearCategoryChangedEvent } from "../../lib/events/gear-category-changed-event";
import { AppEvent } from "../../lib/events/app-event";
import { FilterGearListFeature } from "../../features/gear/filter-gear-list/filter-gear-list-feature";
import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { FilterGearListRequest } from "../../features/gear/filter-gear-list/filter-gear-list-request";

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

        const { shadowRoot } = this;

        if (!shadowRoot) return;

        this.gearList = this.getAllGearFeature.handle(new EmptyRequest());

        this.populateGearTable(shadowRoot);

        this.registerGearCategoryChangedEvent();
    }

    private populateGearTable(shadowRoot: ShadowRoot, clearOldRows: boolean = false) {
        const gearListContainer = shadowRoot.querySelector("#gear-list-container");

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

        row.className = "border-b-2 border-gray-200";

        row.innerHTML = `
            <td class="p-2">${gearItem.name}</td>
            <td class="p-2">${gearItem.abbreviatedCost}</td>
            <td class="p-2">${gearItem.category}</td>
            <td class="p-2">${gearItem.description}</td>
        `;

        return row;
    }

    private registerGearCategoryChangedEvent() {
        EventBus.instance.register(GearCategoryChangedEvent.name, (event: AppEvent) => {
            const customEvent = event as GearCategoryChangedEvent;

            this.filterByCategory(customEvent.category);
        });
    }

    private filterByCategory(category: string) {
        const feature = new FilterGearListFeature(this.unitOfWork);
        const request = new FilterGearListRequest();
        request.category = category;

        const result = feature.handle(request);

        if (result.isFailure) return;

        this.gearList = result.value ?? [];

        const { shadowRoot } = this;

        if (!shadowRoot) return;

        this.populateGearTable(shadowRoot, true);
    }
}

customElements.define("gear-list", GearListComponent);
