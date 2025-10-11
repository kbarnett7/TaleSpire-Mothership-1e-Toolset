import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { DatabaseEntity } from "../../lib/common/features/database-entity";
import { SourcesService } from "../sources/sources-service";

export abstract class GearItem extends DatabaseEntity {
    public static gearCategory: string = "All";

    public sourceId: number;
    public name: string;

    protected validationResults: string[];

    constructor(id?: number, sourceId?: number, name?: string) {
        super(id);
        this.sourceId = sourceId ?? 0;
        this.name = name ?? "";
        this.validationResults = [];
    }

    public canBeDelete(unitOfWork: IUnitOfWork): boolean {
        const customSourceId = SourcesService.instance.getCustomItemSourceId(unitOfWork);

        return this.sourceId === customSourceId;
    }

    public validate(unitOfWork: IUnitOfWork): string[] {
        this.validationResults.length = 0;

        this.validateName().validateItemDoesNotAlreadyExist(unitOfWork);

        return this.validationResults;
    }

    protected validateName(): GearItem {
        if (this.name.trim() == "") {
            this.validationResults.push(`The name \"${this.name}\" is invalid. The name cannot be empty.`);
        } else if (this.name.trim().length > 100) {
            this.validationResults.push(
                `The name \"${this.name}\" is invalid. The name must be 100 characters or less.`
            );
        }

        return this;
    }

    protected getItemAlreadyExistsValidationMessage(gearCategory: string) {
        let prefix = "An";

        if (gearCategory === "Weapon") {
            prefix = "A";
        }

        return `${prefix} ${gearCategory} item with the name \"${this.name}\" already exists. The name must be unique.`;
    }

    public saveToDatabase(unitOfWork: IUnitOfWork): void {
        if (this.id === 0) {
            this.addToDatabase(unitOfWork);
        } else {
            this.updateInDatabase(unitOfWork);
        }
    }

    public abstract deleteFromDatabase(unitOfWork: IUnitOfWork): void;
    protected abstract addToDatabase(unitOfWork: IUnitOfWork): void;
    protected abstract updateInDatabase(unitOfWork: IUnitOfWork): void;
    protected abstract validateItemDoesNotAlreadyExist(unitOfWork: IUnitOfWork): GearItem;
}
