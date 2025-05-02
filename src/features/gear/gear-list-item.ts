import { CreditsAbbreviator } from "../../services/credits-abbreviator";

export class GearListItem {
    public id: number;
    public name: string;
    public description: string;
    public cost: number;
    public category: string;

    public get abbreviatedCost(): string {
        return CreditsAbbreviator.instance.abbreviate(this.cost);
    }

    constructor(id: number, name: string, description: string, cost: number, category: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.category = category.replace("Item", "");
    }
}
