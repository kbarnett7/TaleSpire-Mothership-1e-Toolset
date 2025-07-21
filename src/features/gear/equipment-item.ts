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
        let validationResults: string[] = [];

        if (this.name.trim() == "") {
            validationResults.push(`The name \"${this.name}\" is invalid. The name cannot be empty.`);
        } else if (this.name.trim().length > 50) {
            validationResults.push(`The name \"${this.name}\" is invalid. The name must be 50 characters or less.`);
        }

        return validationResults;
    }
}
