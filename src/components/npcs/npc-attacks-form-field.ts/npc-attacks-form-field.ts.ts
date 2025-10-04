import html from "./npc-attacks-form-field.ts.html";
import { BaseComponent } from "../../base.component";
import { NpcAttackFormFieldsDto } from "../../../features/npcs/npc-attack-form-fields-dto";
import { EventBus } from "../../../lib/events/event-bus";
import { AddNpcAttackButtonClicked } from "../../../lib/events/add-npc-attack-button-clicked";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";

export class NpcAttacksFormFieldComponent extends BaseComponent {
    static formAssociated = true;

    private readonly rowIdPrefix: string = "npcAttack";

    private _internals: ElementInternals;
    private _formFieldsDto: NpcAttackFormFieldsDto[];
    private _nextRowId: number;

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
        this._nextRowId = 1;
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
        this.npcAttacksTableBodyElement.appendChild(this.createNpcAttackTableRowElement());
    };

    private createNpcAttackTableRowElement(): HTMLTableRowElement {
        const rowId = this.generateNewRowId();
        const row = this.createBaseTableRowElement(rowId);

        row.appendChild(this.createAttackNameTableCellElement(rowId));
        row.appendChild(this.createAttackEffectTableCellElement(rowId));
        row.appendChild(this.createDeleteAttackTableCellElement(rowId));

        return row;
    }

    private generateNewRowId(): number {
        return this._nextRowId++;
    }

    private createBaseTableRowElement(rowId: number): HTMLTableRowElement {
        const row = document.createElement("tr");

        row.id = `${this.rowIdPrefix}${rowId}`;
        row.className = "border-b-2 border-black";

        return row;
    }

    private createBaseTableCellElement(): HTMLTableCellElement {
        const cell = document.createElement("td");

        cell.className = "px-1 py-1 text-center";

        return cell;
    }

    private createAttackNameTableCellElement(rowId: number): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();
        const input = document.createElement("input");

        input.id = `inputAttackName${rowId}`;
        input.name = `inputAttackName${rowId}`;
        input.type = "text";
        input.className =
            "block w-full bg-white text-base text-black border-3 border-black px-2 py-1 hover:bg-gray-200 transition duration-150 ease-in-out focus:outline-0";
        input.placeholder = "Enter name of the item...";
        input.ariaPlaceholder = "Enter name of the item...";
        input.maxLength = 100;

        input.addEventListener("change", () => this.handleOnAttackNameInputChanged(rowId));

        cell.appendChild(input);

        return cell;
    }

    private createAttackEffectTableCellElement(rowId: number): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();

        const input = document.createElement("input");

        input.id = `inputAttackEffect${rowId}`;
        input.name = `inputAttackEffect${rowId}`;
        input.type = "text";
        input.className =
            "block w-full bg-white text-base text-black border-3 border-black px-2 py-1 hover:bg-gray-200 transition duration-150 ease-in-out focus:outline-0";
        input.placeholder = "Enter effect of the item...";
        input.ariaPlaceholder = "Enter effect of the item...";
        input.maxLength = 1000;

        input.addEventListener("change", () => this.handleOnAttackEffectInputChanged(rowId));

        cell.appendChild(input);

        return cell;
    }

    private createDeleteAttackTableCellElement(rowId: number): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();
        const button = document.createElement("button");

        button.type = "button";
        button.className =
            "text-black bg-transparent hover:bg-black hover:text-white rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-150 ease-in-out cursor-pointer";

        button.innerHTML = `
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
            <span class="sr-only">Delete NPC attack</span>
        `;

        button.addEventListener("click", () => this.onDeleteAttackButtonClick(rowId));

        cell.appendChild(button);

        return cell;
    }

    public handleOnAttackNameInputChanged(rowId: number) {
        alert(`name updated for row: ${rowId}`);
    }

    public handleOnAttackEffectInputChanged(rowId: number) {
        alert(`effect updated for row: ${rowId}`);
    }

    public onDeleteAttackButtonClick(rowId: number) {
        const row = this.shadow.querySelector(`#${this.rowIdPrefix}${rowId}`) as HTMLTableRowElement;

        row.remove();
    }
}

customElements.define("npc-attacks-form-field", NpcAttacksFormFieldComponent);
