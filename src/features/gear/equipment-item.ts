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

    public validate(): string[] {
        this.validationResults.length = 0;

        (this.validateName() as EquipmentItem).validateDescription().validateCost();

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
}
