import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { GearItem } from "./gear-item";

export class EquipmentItem extends GearItem {
    public static gearCategory: string = "Equipment";

    public description: string;
    public cost: number;

    constructor(id?: number, sourceId?: number, name?: string, description?: string, cost?: number) {
        super(id, sourceId, name);
        this.description = description ?? "";
        this.cost = cost ?? 0;
    }

    protected validateItemDoesNotAlreadyExist(unitOfWork: IUnitOfWork): EquipmentItem {
        const existingItem = unitOfWork.repo(EquipmentItem).first((item) => item.name === this.name);

        if (existingItem && existingItem.id !== this.id) {
            this.validationResults.push(this.getItemAlreadyExistsValidationMessage(EquipmentItem.gearCategory));
        }

        return this;
    }

    public validate(unitOfWork: IUnitOfWork): string[] {
        super.validate(unitOfWork);

        this.validateDescription().validateCost();

        return this.validationResults;
    }

    private validateDescription(): EquipmentItem {
        if (this.description.trim().length > 1000) {
            this.validationResults.push(
                `The description \"${this.description}\" is invalid. The description must be 1,000 characters or less.`
            );
        }

        return this;
    }

    private validateCost(): EquipmentItem {
        if (this.cost < 0) {
            this.validationResults.push(
                `The cost \"${this.cost}\" is invalid. The cost must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        }

        return this;
    }

    public addToDatabase(unitOfWork: IUnitOfWork): void {
        this.id = this.generateId(unitOfWork);
        this.sourceId = this.getCustomItemSourceId(unitOfWork);

        unitOfWork.repo(EquipmentItem).add(this);
    }

    public deleteFromDatabase(unitOfWork: IUnitOfWork): void {
        unitOfWork.repo(EquipmentItem).remove(this);
    }

    protected getLargestItemIdInDatabase(unitOfWork: IUnitOfWork): number {
        const sortedItems = unitOfWork
            .repo(EquipmentItem)
            .list()
            .sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }
}
