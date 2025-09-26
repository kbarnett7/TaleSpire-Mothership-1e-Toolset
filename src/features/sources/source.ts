import { DatabaseEntity } from "../../lib/common/features/database-entity";

export class Source extends DatabaseEntity {
    public name: string;

    constructor(id?: number, name?: string) {
        super(id);
        this.name = name ?? "";
    }
}
