import { NpcAttack } from "./npc-attack";
import { NpcSpecialAbility } from "./npc-special-ability";

export class Npc {
    public id: number;
    public sourceId: number;
    public name: string;
    public combat: number;
    public instinct: number;
    public armorPoints: number;
    public health: number;
    public maximumWounds: number;
    public description: string;
    public attacks: NpcAttack[];
    public specialAbilities: NpcSpecialAbility[];

    constructor(
        id?: number,
        sourceId?: number,
        name?: string,
        combat?: number,
        instinct?: number,
        armorPoints?: number,
        health?: number,
        maximumWounds?: number,
        description?: string,
        attacks?: NpcAttack[],
        specialAbilities?: NpcSpecialAbility[]
    ) {
        this.id = id ?? 0;
        this.sourceId = sourceId ?? 0;
        this.name = name ?? "";
        this.combat = combat ?? 0;
        this.instinct = instinct ?? 0;
        this.armorPoints = armorPoints ?? 0;
        this.health = health ?? 0;
        this.maximumWounds = maximumWounds ?? 0;
        this.description = description ?? "";
        this.attacks = attacks ?? [];
        this.specialAbilities = specialAbilities ?? [];
    }
}
