import { DatabaseEntity } from "../../lib/common/features/database-entity";
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
}
