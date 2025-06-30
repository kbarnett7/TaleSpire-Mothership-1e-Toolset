import { ErrorCode } from "../../errors/error-code";
import { AppLogger } from "../../logging/app-logger";
import { Result } from "../../result/result";
import { ResultError } from "../../result/result-error";
import { IUnitOfWork } from "../data-access/unit-of-work-interface";

export class FilterListFeature {
    protected readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    protected returnErrorResult<T>(ex: Error, itemNameForLogs: string): Result<T> {
        AppLogger.instance.error(`Error while filtering ${itemNameForLogs} list`, ex);

        return Result.failure(
            new ResultError(
                ErrorCode.QueryError,
                `Failed to filter ${itemNameForLogs} list due to the follow error: ${ex.message}`
            )
        );
    }

    protected applySearchFilter<T>(listItems: T[], search: string, searchFieldGetter: (item: T) => string): T[] {
        const filter: string = search.trim().toLowerCase();

        if (filter === "") return listItems;

        const escapedFilter = this.escapeRegExpCharacters(filter);
        const searchRegEx = new RegExp(`^.*(${escapedFilter})+.*$`);

        return listItems.filter((item) => searchFieldGetter(item).trim().toLowerCase().match(searchRegEx));
    }

    private escapeRegExpCharacters(input: string): string {
        return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special regex characters
    }
}
