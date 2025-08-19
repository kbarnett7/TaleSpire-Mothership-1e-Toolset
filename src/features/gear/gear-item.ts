import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";

export abstract class GearItem {
    public static gearCategory: string = "All";

    public id: number;
    public sourceId: number;
    public name: string;

    protected validationResults: string[];

    constructor(id?: number, sourceId?: number, name?: string) {
        this.id = id ?? 0;
        this.sourceId = sourceId ?? 0;
        this.name = name ?? "";
        this.validationResults = [];
    }

    protected abstract validateItemDoesNotAlreadyExist(unitOfWork: IUnitOfWork): GearItem;

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
}
