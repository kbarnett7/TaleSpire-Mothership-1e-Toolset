import { CreditsAbbreviator } from "../../lib/services/credits-abbreviator";

export class GearListItem {
    public id: number;
    public sourceId: number;
    public name: string;
    public description: string;
    public cost: number;
    public category: string;

    public get abbreviatedCost(): string {
        return CreditsAbbreviator.instance.abbreviate(this.cost);
    }

    constructor(id: number, sourceId: number, name: string, description: string, cost: number, category: string) {
        this.id = id;
        this.sourceId = sourceId;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.category = category;
    }
}
