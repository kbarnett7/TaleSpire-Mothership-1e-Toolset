import { SortState } from "../../../lib/sorting/sort-state";
import { NpcListItem } from "../npc-list-item";

export class SortNpcsListRequest {
    public npcListItems: NpcListItem[] = [];
    public sortState: SortState = new SortState();
}
