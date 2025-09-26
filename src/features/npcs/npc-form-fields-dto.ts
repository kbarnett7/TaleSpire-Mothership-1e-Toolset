export class NpcFormFieldsDto {
    public name: string;
    public description: string;
    public combat: string;
    public instinct: string;
    public armorPoints: string;
    public health: string;
    public maximumWounds: string;

    constructor(
        name?: string,
        description?: string,
        combat?: string,
        instinct?: string,
        armorPoints?: string,
        health?: string,
        maximumWounds?: string
    ) {
        this.name = name ?? "";
        this.description = description ?? "";
        this.combat = combat ?? "0";
        this.instinct = instinct ?? "0";
        this.armorPoints = armorPoints ?? "0";
        this.health = health ?? "0";
        this.maximumWounds = maximumWounds ?? "0";
    }
}
