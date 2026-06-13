import { SortState } from "../../../lib/sorting/sort-state";
import { PlayerCharacterListItem } from "../player-character-list-item";

export class SortPlayerCharactersListRequest {
    public playerCharacterListItems: PlayerCharacterListItem[] = [];
    public sortState: SortState = new SortState();
}
