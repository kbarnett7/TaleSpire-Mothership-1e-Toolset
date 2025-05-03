import html from "./gear-list.html";
import { BaseComponent } from "../base.component";
import { GetAllGearFeature } from "../../features/gear/get-all-gear/get-all-gear-feature";
import { GearListItem } from "../../features/gear/gear-list-item";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { EmptyRequest } from "../../lib/common/features/empty-request";

export class GearListComponent extends BaseComponent {
    private getAllGearFeature: GetAllGearFeature;
    private gearList: Array<GearListItem> = [];

    constructor() {
        super();
        const unitOfWork = appInjector.injectClass(UnitOfWork);
        this.getAllGearFeature = new GetAllGearFeature(unitOfWork);
    }

    public connectedCallback() {
        this.render(html);

        const { shadowRoot } = this;

        if (!shadowRoot) return;

        this.gearList = this.getAllGearFeature.handle(new EmptyRequest());

        this.populateGearTable(shadowRoot);
    }

    private populateGearTable(shadowRoot: ShadowRoot) {
        const gearListContainer = shadowRoot.querySelector("#gear-list-container");

        if (!gearListContainer) return;

        const tableBody = gearListContainer.querySelector("tbody");

        if (!tableBody) return;

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
}

customElements.define("gear-list", GearListComponent);
