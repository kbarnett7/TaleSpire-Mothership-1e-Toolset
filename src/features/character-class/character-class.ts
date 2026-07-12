import { DatabaseEntity } from "../../lib/common/features/database-entity";
import { Stat } from "../stat-modifiers/stat";
import { StatModifier } from "../stat-modifiers/stat-modifier";

export class CharacterClass extends DatabaseEntity {
    public sourceId: number;
    public name: string;
    public description: string;
    public statModifiers: StatModifier[];

    constructor(id?: number, sourceId?: number, name?: string, description?: string, statModifiers?: StatModifier[]) {
        super(id);
        this.sourceId = sourceId ?? 0;
        this.name = name ?? "";
        this.description = description ?? "";
        this.statModifiers = statModifiers ?? [];
    }

    public getNonUserChoiceStatModifiers() {
        return this.statModifiers
            .filter((statModifier) => statModifier.stat !== Stat.UserChoice)
            .map((statModifier) => new StatModifier(statModifier.stat, statModifier.modifier, statModifier.source));
    }

    public getUserChoiceStatModifiers() {
        return this.statModifiers
            .filter((statModifier) => statModifier.stat === Stat.UserChoice)
            .map((statModifier) => new StatModifier(statModifier.stat, statModifier.modifier, statModifier.source));
    }
}
