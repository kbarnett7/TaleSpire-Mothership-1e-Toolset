import { DatabaseEntity } from "../../lib/common/features/database-entity";

export class DatabaseVersion extends DatabaseEntity {
    public version: string;

    constructor(id?: number, version?: string) {
        super(id);
        this.version = version ?? "";
    }
}
