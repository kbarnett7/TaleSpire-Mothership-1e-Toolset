import { DatabaseEntity } from "../../lib/common/features/database-entity";

export class CharacterClass extends DatabaseEntity {
    public sourceId: number;
    public name: string;
    public description: string;

    constructor(id?: number, sourceId?: number, name?: string, description?: string) {
        super(id);
        this.sourceId = sourceId ?? 0;
        this.name = name ?? "";
        this.description = description ?? "";
    }
}
