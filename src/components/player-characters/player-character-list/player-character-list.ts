import html from "./player-character-list.html";
import { GetAllPlayerCharactersFeature } from "../../../features/player-characters/get-all-player-characters/get-all-player-characters-feature";
import { FilterPlayerCharactersListFeature } from "../../../features/player-characters/filter-player-characters-list/filter-player-characters-list-feature";
import { FilterPlayerCharactersListRequest } from "../../../features/player-characters/filter-player-characters-list/filter-player-characters-list-request";
import { SortPlayerCharactersListFeature } from "../../../features/player-characters/sort-player-characters-list/sort-player-characters-list-feature";
import { SortPlayerCharactersListRequest } from "../../../features/player-characters/sort-player-characters-list/sort-player-characters-list-request";
import { PlayerCharacterListItem } from "../../../features/player-characters/player-character-list-item";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEvent } from "../../../lib/events/app-event";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { PlayerCharacterFilterChangedEvent } from "../../../lib/events/player-character-filter-changed-event";
import { PlayerCharacterDeletedEvent } from "../../../lib/events/player-character-deleted-event";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";
import { TableHeader } from "../../../lib/tables/table-header";
import { BaseListComponent } from "../../base-list/base-list-component";
import { PlayerCharacterDisplayDialogComponent } from "../player-character-display-dialog/player-character-display-dialog";

export class PlayerCharacterListComponent extends BaseListComponent {
    private playerCharactersList: Array<PlayerCharacterListItem>;
    private currentFilters: PlayerCharacterFilterChangedEvent;

    constructor() {
        super(SortPlayerCharactersListFeature.fieldId, [
            new TableHeader(SortPlayerCharactersListFeature.fieldName, "Name"),
            new TableHeader(SortPlayerCharactersListFeature.fieldClass, "Class"),
        ]);
        this.playerCharactersList = [];
        this.currentFilters = new PlayerCharacterFilterChangedEvent("", "");
    }

    public connectedCallback() {
        this.render(html);

        const feature = new GetAllPlayerCharactersFeature(this.unitOfWork);
        this.playerCharactersList = feature.handle(new EmptyRequest());

        this.sortItems();

        this.populateTableHeaderRow();
        this.populateTableRows();

        EventBus.instance.register(PlayerCharacterFilterChangedEvent.name, this.onPlayerCharacterFilterChangedEvent);
        EventBus.instance.register(PlayerCharacterDeletedEvent.name, this.onPlayerCharacterDeletedEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(PlayerCharacterFilterChangedEvent.name, this.onPlayerCharacterFilterChangedEvent);
        EventBus.instance.unregister(PlayerCharacterDeletedEvent.name, this.onPlayerCharacterDeletedEvent);
    }

    protected override createTableRowsElements(tableBody: HTMLTableSectionElement) {
        this.playerCharactersList.forEach((item) => {
            tableBody.appendChild(this.createTableRowElement(item));
        });
    }

    private createTableRowElement(pc: PlayerCharacterListItem): HTMLTableRowElement {
        const row = this.createBaseTableRowElement();

        row.innerHTML = `
            <td class="p-2">${pc.name}</td>
            <td class="p-2">${pc.characterClass}</td>
        `;

        row.addEventListener("click", () => this.onTableDataRowClick(pc));

        return row;
    }

    protected override sortItems() {
        this.tableHeaders.forEach((header) => {
            this.updateSortIcons(header.field);
        });

        const feature = new SortPlayerCharactersListFeature();
        const request = new SortPlayerCharactersListRequest();

        request.playerCharacterListItems = this.playerCharactersList;
        request.sortState = this.sortState;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        this.playerCharactersList = result.value ?? [];
    }

    public onTableDataRowClick(pc: PlayerCharacterListItem) {
        const dialog = this.shadow.querySelector("#playerCharacterDisplayDialog") as PlayerCharacterDisplayDialogComponent;

        if (!dialog) {
            this.dispatchErrorEvent('Dialog "playerCharacterDisplayDialog" not found.');
            return;
        }

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        dialog.setPlayerCharacter(pc.id);
        dialog.openModal();
    }

    private onPlayerCharacterFilterChangedEvent: AppEventListener = (event: AppEvent) => {
        this.filterPlayerCharacters(event as PlayerCharacterFilterChangedEvent);
    };

    private filterPlayerCharacters(event: PlayerCharacterFilterChangedEvent) {
        this.currentFilters = event;

        const feature = new FilterPlayerCharactersListFeature(this.unitOfWork);
        const request = new FilterPlayerCharactersListRequest();

        request.search = event.search;
        request.characterClass = event.characterClass;

        const result = feature.handle(request);

        if (result.isFailure) {
            this.dispatchErrorEvent(result.error.description);
            return;
        }

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        this.playerCharactersList = result.value ?? [];

        this.sortItems();

        this.populateTableRows(true);
    }

    private onPlayerCharacterDeletedEvent: AppEventListener = (event: AppEvent) => {
        this.filterPlayerCharacters(this.currentFilters);
    };
}

customElements.define("player-character-list", PlayerCharacterListComponent);
