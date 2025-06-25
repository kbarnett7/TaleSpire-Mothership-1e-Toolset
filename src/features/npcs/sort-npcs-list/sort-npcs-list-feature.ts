import { IFeature } from "../../../lib/common/features/feature-interface";
import { SortListFeature } from "../../../lib/common/features/sort-list-feature";
import { ErrorCode } from "../../../lib/errors/error-code";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { SortDirection } from "../../../lib/sorting/sort-direction";
import { NpcListItem } from "../npc-list-item";
import { SortNpcsListRequest } from "./sort-npcs-list-request";

export class SortNpcsListFeature
    extends SortListFeature
    implements IFeature<SortNpcsListRequest, Result<NpcListItem[]>>
{
    static fieldId: string = "Id";
    static fieldName: string = "Name";
    static fieldCombat: string = "Combat";
    static fieldInstinct: string = "Instinct";
    static fieldArmorPoints: string = "Armor Points";
    static fieldWoundsHealth: string = "Max Wounds (Health)";

    constructor() {
        super([
            SortNpcsListFeature.fieldId,
            SortNpcsListFeature.fieldName,
            SortNpcsListFeature.fieldCombat,
            SortNpcsListFeature.fieldInstinct,
            SortNpcsListFeature.fieldArmorPoints,
            SortNpcsListFeature.fieldWoundsHealth,
        ]);
    }

    public handle(request: SortNpcsListRequest): Result<NpcListItem[]> {
        try {
            if (!this.isValidField(request.sortState.field)) return Result.success(request.npcListItems);

            const sortedResults = this.sortNpcListItems(request);

            return Result.success(sortedResults);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error("Error while sorting NPCs list", ex);

            return Result.failure(
                new ResultError(ErrorCode.QueryError, `Failed to sort NPC list due to the follow error: ${ex.message}`)
            );
        }
    }

    public sortNpcListItems(request: SortNpcsListRequest): NpcListItem[] {
        return [...request.npcListItems].sort((a, b) => {
            if (request.sortState.direction === SortDirection.None) {
                return a.id - b.id;
            } else if (request.sortState.field === SortNpcsListFeature.fieldName) {
                return this.sortByStringField(a.name, b.name, request.sortState);
            } else {
                return this.sortByNumberField(a.id, b.id, request.sortState);
            }
        });
    }
}
