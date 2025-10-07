import html from "./npc-attacks-form-field.html";
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
    private _formFieldsDtoMap: Map<number, NpcAttackFormFieldsDto>;
    private _nextRowId: number;

    public get npcAttacksTableBodyElement(): HTMLTableSectionElement {
        return this.shadow.querySelector("#npcAttacksTableBody") as HTMLTableSectionElement;
    }

    public get value(): string {
        let formFieldDtos: NpcAttackFormFieldsDto[] = [];

        for (const dto of this._formFieldsDtoMap.values()) {
            if (dto.name.length > 0 || dto.effect.length > 0) {
                formFieldDtos.push(dto);
            }
        }

        return JSON.stringify(formFieldDtos);
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDtoMap = new Map<number, NpcAttackFormFieldsDto>();
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

        this.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private onAddNpcAttackButtonClicked: AppEventListener = (event: AppEvent) => {
        const rowId = this.generateNewRowId();

        this.npcAttacksTableBodyElement.appendChild(this.createNpcAttackTableRowElement(rowId));

        this._formFieldsDtoMap.set(rowId, new NpcAttackFormFieldsDto());
    };

    private createNpcAttackTableRowElement(rowId: number): HTMLTableRowElement {
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

        input.addEventListener("change", (event) => this.handleOnAttackNameInputChanged(event, rowId));

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

        input.addEventListener("change", (event) => this.handleOnAttackEffectInputChanged(event, rowId));

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

    private getTableRowElementByRowId(rowId: number): HTMLTableRowElement {
        return this.shadow.querySelector(`#${this.rowIdPrefix}${rowId}`) as HTMLTableRowElement;
    }

    public handleOnAttackNameInputChanged(event: Event, rowId: number) {
        const dto = this._formFieldsDtoMap.get(rowId);

        if (!dto) {
            return;
        }

        dto.name = (event.target as HTMLInputElement).value;

        this.updateFormValue();
    }

    public handleOnAttackEffectInputChanged(event: Event, rowId: number) {
        const dto = this._formFieldsDtoMap.get(rowId);

        if (!dto) {
            return;
        }

        dto.effect = (event.target as HTMLInputElement).value;

        this.updateFormValue();
    }

    public onDeleteAttackButtonClick(rowId: number) {
        const row = this.getTableRowElementByRowId(rowId);

        this._formFieldsDtoMap.delete(rowId);

        row.remove();

        this.updateFormValue();
    }
}

customElements.define("npc-attacks-form-field", NpcAttacksFormFieldComponent);
