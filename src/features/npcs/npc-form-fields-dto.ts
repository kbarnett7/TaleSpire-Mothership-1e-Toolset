import { NpcAttackFormFieldsDto } from "./npc-attack-form-fields-dto";
import { NpcSpecialAbilityFormFieldsDto } from "./npc-special-ability-form-fields-dto";

export class NpcFormFieldsDto {
    public name: string;
    public description: string;
    public combat: string;
    public instinct: string;
    public armorPoints: string;
    public health: string;
    public maximumWounds: string;
    public attacks: NpcAttackFormFieldsDto[];
    public specialAbilities: NpcSpecialAbilityFormFieldsDto[];

    constructor(
        name?: string,
        description?: string,
        combat?: string,
        instinct?: string,
        armorPoints?: string,
        health?: string,
        maximumWounds?: string,
        attacks?: NpcAttackFormFieldsDto[],
        specialAbilities?: NpcSpecialAbilityFormFieldsDto[]
    ) {
        this.name = name ?? "";
        this.description = description ?? "";
        this.combat = combat ?? "0";
        this.instinct = instinct ?? "0";
        this.armorPoints = armorPoints ?? "0";
        this.health = health ?? "0";
        this.maximumWounds = maximumWounds ?? "0";
        this.attacks = attacks ?? [];
        this.specialAbilities = specialAbilities ?? [];
    }

    public toJson(): string {
        return JSON.stringify(this);
    }
}
