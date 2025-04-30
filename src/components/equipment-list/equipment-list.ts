import html from "./equipment-list.html";
import { BaseComponent } from "../base.component";
import { EquipementItem } from "../../features/equipment/equipment-item";

export class EquipmentListComponent extends BaseComponent {
    private equipmentList: Array<EquipementItem> = [];
    constructor() {
        super();
        
        this.equipmentList = [
            {
                id: 1,
                name: "Sword",
                description: "A sharp blade.",
                cost: 100,
            },
            {
                id: 2,
                name: "Shield",
                description: "A sturdy shield.",
                cost: 150,
            },
            {
                id: 3,
                name: "Bow",
                description: "A long-range weapon.",
                cost: 200,
            },
        ];
    }

    public connectedCallback() {
        this.render(html);

        const { shadowRoot } = this;

        if (!shadowRoot) return;

        const equipmentListContainer = shadowRoot.querySelector("#equipment-list-container");
        if (!equipmentListContainer) return;
        const tableBody = equipmentListContainer.querySelector("tbody")
        if (!tableBody) return;
        this.equipmentList.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.cost}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

customElements.define("equipment-list", EquipmentListComponent);