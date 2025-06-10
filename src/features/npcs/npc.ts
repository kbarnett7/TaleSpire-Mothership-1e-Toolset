export class Npc {
    public id: number;
    public name: string;
    public combat: number;
    public instinct: number;
    public armorPoints: number;
    public health: number;
    public maximumWounds: number;

    constructor(
        id?: number,
        name?: string,
        combat?: number,
        instinct?: number,
        armorPoints?: number,
        health?: number,
        maximumWounds?: number
    ) {
        this.id = id ?? 0;
        this.name = name ?? "";
        this.combat = combat ?? 0;
        this.instinct = instinct ?? 0;
        this.armorPoints = armorPoints ?? 0;
        this.health = health ?? 0;
        this.maximumWounds = maximumWounds ?? 0;
    }
}
