import { IFeature } from "../../../lib/common/features/feature-interface";
import { SortListFeature } from "../../../lib/common/features/sort-list-feature";
import { ErrorCode } from "../../../lib/errors/error-code";
import { AppLogger } from "../../../lib/logging/app-logger";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { SortDirection } from "../../../lib/sorting/sort-direction";
import { PlayerCharacterListItem } from "../player-character-list-item";
import { SortPlayerCharactersListRequest } from "./sort-player-characters-list-request";

export class SortPlayerCharactersListFeature
    extends SortListFeature
    implements IFeature<SortPlayerCharactersListRequest, Result<PlayerCharacterListItem[]>>
{
    static fieldId: string = "id";
    static fieldName: string = "name";
    static fieldClass: string = "characterClass";

    constructor() {
        super([
            SortPlayerCharactersListFeature.fieldId,
            SortPlayerCharactersListFeature.fieldName,
            SortPlayerCharactersListFeature.fieldClass,
        ]);
    }

    public handle(request: SortPlayerCharactersListRequest): Result<PlayerCharacterListItem[]> {
        try {
            if (!this.isValidField(request.sortState.field)) return Result.success(request.playerCharacterListItems);

            const sortedResults = this.sortPlayerCharacterListItems(request);

            return Result.success(sortedResults);
        } catch (error) {
            const ex = error as Error;

            AppLogger.instance.error("Error while sorting Player Characters list", ex);

            return Result.failure(
                new ResultError(
                    ErrorCode.QueryError,
                    `Failed to sort Player Characters list due to the following error: ${ex.message}`
                )
            );
        }
    }

    public sortPlayerCharacterListItems(request: SortPlayerCharactersListRequest): PlayerCharacterListItem[] {
        return [...request.playerCharacterListItems].sort((a, b) => {
            if (request.sortState.direction === SortDirection.None) {
                return a.id - b.id;
            } else if (request.sortState.field === SortPlayerCharactersListFeature.fieldName) {
                return this.sortByStringField(a.name, b.name, request.sortState);
            } else if (request.sortState.field === SortPlayerCharactersListFeature.fieldClass) {
                return this.sortByStringField(a.characterClass, b.characterClass, request.sortState);
            } else {
                return this.sortByNumberField(a.id, b.id, request.sortState);
            }
        });
    }
}
