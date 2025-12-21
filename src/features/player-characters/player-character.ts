import { DatabaseEntity } from "../../lib/common/features/database-entity";

export class PlayerCharacter extends DatabaseEntity {
    public name: string;
    public characterClass: string;
    public description: string;

    constructor(id?: number, name?: string, characterClass?: string, description?: string) {
        super(id);
        this.name = name ?? "";
        this.characterClass = characterClass ?? "";
        this.description = description ?? "";
    }
}
