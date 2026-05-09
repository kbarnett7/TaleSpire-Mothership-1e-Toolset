import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { FilterListFeature } from "../../../lib/common/features/filter-list-feature";
import { Result } from "../../../lib/result/result";
import { GetAllPlayerCharactersFeature } from "../get-all-player-characters/get-all-player-characters-feature";
import { PlayerCharacterListItem } from "../player-character-list-item";
import { FilterPlayerCharactersListRequest } from "./filter-player-characters-list-request";

export class FilterPlayerCharactersListFeature
    extends FilterListFeature
    implements IFeature<FilterPlayerCharactersListRequest, Result<PlayerCharacterListItem[]>>
{
    private readonly getAllItemsFeature: GetAllPlayerCharactersFeature;

    constructor(unitOfWork: IUnitOfWork) {
        super(unitOfWork);
        this.getAllItemsFeature = new GetAllPlayerCharactersFeature(this.unitOfWork);
    }

    public handle(request: FilterPlayerCharactersListRequest): Result<PlayerCharacterListItem[]> {
        try {
            let filteredItems: PlayerCharacterListItem[] = this.getAllItemsFeature.handle(new EmptyRequest());

            filteredItems = this.applySearchFilter<PlayerCharacterListItem>(
                filteredItems,
                request.search,
                this.getSearchField
            );
            filteredItems = this.applyClassFilter(filteredItems, request.characterClass);

            return Result.success(filteredItems);
        } catch (error) {
            return this.returnErrorResult<PlayerCharacterListItem[]>(error as Error, "Player Characters");
        }
    }

    private getSearchField(item: PlayerCharacterListItem): string {
        return item.name;
    }

    private applyClassFilter(listItems: PlayerCharacterListItem[], characterClass: string): PlayerCharacterListItem[] {
        if (characterClass.trim() === "") {
            return listItems;
        }

        return listItems.filter((item) => item.characterClass === characterClass);
    }
}
