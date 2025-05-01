import html from "./gear-list.html";
import { BaseComponent } from "../base.component";
import { GearItem } from "../../features/gear/gear-item";
import { GearRepository } from "../../features/gear/gear-repository";

export class GearListComponent extends BaseComponent {
    private gearRepository: GearRepository
    private gearList: Array<GearItem> = [];

    constructor() {
        super();
        this.gearRepository = new GearRepository();
        this.gearList = this.gearRepository.list();
    }

    public connectedCallback() {
        this.render(html);

        const { shadowRoot } = this;

        if (!shadowRoot) return;

        this.populateGearTable(shadowRoot);
    }

    private populateGearTable(shadowRoot: ShadowRoot) {
        const gearListContainer = shadowRoot.querySelector("#gear-list-container");

        if (!gearListContainer) return;

        const tableBody = gearListContainer.querySelector("tbody")

        if (!tableBody) return;

        this.gearList.forEach((item) => {
            tableBody.appendChild(this.createTableRowElement(item));
        });
    }

    private createTableRowElement(gearItem: GearItem): HTMLTableRowElement {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${gearItem.id}</td>
            <td>${gearItem.name}</td>
            <td>${gearItem.description}</td>
            <td>${gearItem.cost}</td>
        `;

        return row;
    }
}

customElements.define("gear-list", GearListComponent);