export class NpcListItem {
    public id: number;
    public name: string;
    public combat: number;
    public instinct: number;
    public armorPoints: number;
    public health: number;
    public maximumWounds: number;

    constructor(
        id: number,
        name: string,
        combat: number,
        instinct: number,
        armorPoints: number,
        health: number,
        maximumWounds: number
    ) {
        this.id = id;
        this.name = name;
        this.combat = combat;
        this.instinct = instinct;
        this.armorPoints = armorPoints;
        this.health = health;
        this.maximumWounds = maximumWounds;
    }
}
