import { BaseComponent } from "../base.component";

export abstract class BaseDoubleInputRowsTableComponent<TDto> extends BaseComponent {
    static formAssociated = true;

    private readonly rowIdPrefix: string = "row";

    private _internals: ElementInternals;
    protected _formFieldsDtoMap: Map<number, TDto>;
    private _nextRowId: number;
    private _inputOneName: string;
    private _inputTwoName: string;
    private _tableBodyElementId: string;
    private _deleteScreenReaderMessage: string;

    public get tableBodyElement(): HTMLTableSectionElement {
        return this.shadow.querySelector(`#${this._tableBodyElementId}`) as HTMLTableSectionElement;
    }

    public get value(): string {
        let formFieldDtos: TDto[] = [];

        for (const dto of this._formFieldsDtoMap.values()) {
            if (this.isDtoValid(dto)) {
                formFieldDtos.push(dto);
            }
        }

        return JSON.stringify(formFieldDtos);
    }

    constructor(
        inputOneName: string,
        inputTwoName: string,
        tableBodyElementId: string,
        deleteScreenReaderMessage: string
    ) {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDtoMap = new Map<number, TDto>();
        this._nextRowId = 1;
        this._inputOneName = inputOneName;
        this._inputTwoName = inputTwoName;
        this._tableBodyElementId = tableBodyElementId;
        this._deleteScreenReaderMessage = deleteScreenReaderMessage;
    }

    public connectedCallback() {
        this.updateFormValue();
    }

    protected updateFormValue() {
        this._internals.setFormValue(this.value);

        this.dispatchEvent(new Event("change", { bubbles: true }));
    }

    protected addNewTableRow(): number {
        const rowId = this.generateNewRowId();

        this.tableBodyElement.appendChild(this.createTableRowElement(rowId));

        return rowId;
    }

    private generateNewRowId(): number {
        return this._nextRowId++;
    }

    private createTableRowElement(rowId: number): HTMLTableRowElement {
        const row = this.createBaseTableRowElement(rowId);

        row.appendChild(this.createFirstInputTableCellElement(rowId));
        row.appendChild(this.createSecondInputTableCellElement(rowId));
        row.appendChild(this.createDeleteTableCellElement(rowId));

        return row;
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

    private createFirstInputTableCellElement(rowId: number): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();
        const input = document.createElement("input");

        input.id = `inputOne${rowId}`;
        input.name = `inputOne${rowId}`;
        input.type = "text";
        input.className =
            "block w-full bg-white text-base text-black border-3 border-black px-2 py-1 hover:bg-gray-200 transition duration-150 ease-in-out focus:outline-0";
        input.placeholder = `Enter the ${this._inputOneName}...`;
        input.ariaPlaceholder = `Enter the ${this._inputOneName}...`;
        input.maxLength = 100;

        input.addEventListener("change", (event) => this.handleOnInputOneChanged(event, rowId));

        cell.appendChild(input);

        return cell;
    }

    private createSecondInputTableCellElement(rowId: number): HTMLTableCellElement {
        const cell = this.createBaseTableCellElement();

        const input = document.createElement("input");

        input.id = `inputTwo${rowId}`;
        input.name = `inputTwo${rowId}`;
        input.type = "text";
        input.className =
            "block w-full bg-white text-base text-black border-3 border-black px-2 py-1 hover:bg-gray-200 transition duration-150 ease-in-out focus:outline-0";
        input.placeholder = `Enter the ${this._inputTwoName}...`;
        input.ariaPlaceholder = `Enter the ${this._inputTwoName}...`;
        input.maxLength = 1000;

        input.addEventListener("change", (event) => this.handleOnInputTwoChanged(event, rowId));

        cell.appendChild(input);

        return cell;
    }

    private createDeleteTableCellElement(rowId: number): HTMLTableCellElement {
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
            <span class="sr-only">${this._deleteScreenReaderMessage}</span>
        `;

        button.addEventListener("click", () => this.onDeleteButtonClick(rowId));

        cell.appendChild(button);

        return cell;
    }

    public onDeleteButtonClick(rowId: number) {
        const row = this.getTableRowElementByRowId(rowId);

        this._formFieldsDtoMap.delete(rowId);

        row.remove();

        this.updateFormValue();
    }

    private getTableRowElementByRowId(rowId: number): HTMLTableRowElement {
        return this.shadow.querySelector(`#${this.rowIdPrefix}${rowId}`) as HTMLTableRowElement;
    }

    protected abstract isDtoValid(dto: TDto): boolean;
    protected abstract handleOnInputOneChanged(event: Event, rowId: number): void;
    protected abstract handleOnInputTwoChanged(event: Event, rowId: number): void;
}
