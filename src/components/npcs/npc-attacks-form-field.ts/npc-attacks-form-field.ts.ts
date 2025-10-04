import html from "./npc-attacks-form-field.ts.html";
import { BaseComponent } from "../../base.component";
import { NpcAttackFormFieldsDto } from "../../../features/npcs/npc-attack-form-fields-dto";
import { EventBus } from "../../../lib/events/event-bus";
import { AddNpcAttackButtonClicked } from "../../../lib/events/add-npc-attack-button-clicked";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";

export class NpcAttacksFormFieldComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    private _formFieldsDto: NpcAttackFormFieldsDto[];

    public get npcAttacksTableBodyElement(): HTMLTableSectionElement {
        return this.shadow.querySelector("#npcAttacksTableBody") as HTMLTableSectionElement;
    }

    public get value(): string {
        return JSON.stringify(this._formFieldsDto);
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = [];
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();

        EventBus.instance.register(AddNpcAttackButtonClicked.name, this.onAddNpcAttackButtonClicked);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(AddNpcAttackButtonClicked.name, this.onAddNpcAttackButtonClicked);
    }

    private updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    private onAddNpcAttackButtonClicked: AppEventListener = (event: AppEvent) => {
        this.npcAttacksTableBodyElement.appendChild(this.createTableRowElement());
    };

    private createTableRowElement(): HTMLTableRowElement {
        const row = this.createBaseTableRowElement();

        row.appendChild(this.createAttackNameTableCellElement());
        row.appendChild(this.createAttackEffectTableCellElement());
        row.appendChild(this.createDeleteAttackTableCellElement());

        // row.innerHTML = `
        //         <td class="p-2">${npcListItem.name}</td>
        //         <td class="p-2">${this.convertNumberFieldToString(npcListItem.combat)}</td>
        //         <td class="p-2">${this.convertNumberFieldToString(npcListItem.instinct)}</td>
        //         <td class="p-2">${this.convertNumberFieldToString(npcListItem.armorPoints)}</td>
        //         <td class="p-2">${this.convertNumberFieldToString(
        //             npcListItem.maximumWounds
        //         )} (${this.convertNumberFieldToString(npcListItem.health)})</td>
        //     `;

        // row.addEventListener("click", (event: MouseEvent) => this.onTableDataRowClick(npcListItem));

        return row;
    }

    private createBaseTableRowElement(): HTMLTableRowElement {
        const row = document.createElement("tr");

        row.className = "border-b-2 border-black";

        return row;
    }

    private createBaseTableCellElement(): HTMLTableCellElement {
        const cell = document.createElement("td");

        cell.className = "px-1 py-1 text-center";

        return cell;
    }

    private createAttackNameTableCellElement(): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();

        cell.innerHTML = `
            <input
                id="inputAttackName1"
                name="inputAttackName1"
                type="text"
                class="block w-full bg-white text-base text-black border-3 border-black px-2 py-1 hover:bg-gray-200 transition duration-150 ease-in-out focus:outline-0"
                placeholder="Enter name of the item..."
                aria-placeholder="Enter name of the item..."
                required
                aria-required
                maxlength="100"
                onchange="this.handleOnNameInputChanged(event)"
            />
        `;

        return cell;
    }

    private createAttackEffectTableCellElement(): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();

        cell.innerHTML = `
            <input
                id="inputAttackEffect1"
                name="inputAttackEffect1"
                type="text"
                class="block w-full bg-white text-base text-black border-3 border-black px-2 py-1 hover:bg-gray-200 transition duration-150 ease-in-out focus:outline-0"
                placeholder="Enter effect of the item..."
                aria-placeholder="Enter effect of the item..."
                required
                aria-required
                maxlength="100"
                onchange="this.handleOnNameInputChanged(event)"
            />
        `;

        return cell;
    }

    private createDeleteAttackTableCellElement(): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();

        cell.innerHTML = `
            <button
                id="deleteItemButton"
                type="button"
                class="text-black bg-transparent hover:bg-black hover:text-white rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-150 ease-in-out cursor-pointer"
                onclick="this.onDeleteButtonClick(event)"
            >
                <svg
                    class="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                >
                    <path
                        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                    />
                </svg>
                <span class="sr-only">Delete item</span>
            </button>
        `;

        return cell;
    }
}

customElements.define("npc-attacks-form-field", NpcAttacksFormFieldComponent);
