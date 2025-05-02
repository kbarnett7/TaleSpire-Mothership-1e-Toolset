import { ArmorItem } from "./armor-item";
import { IDatabase } from "../../data-access/database-interface";

export class ArmorRepository {
    private db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    public list(): ArmorItem[] {
        return this.db.getSet<ArmorItem>(ArmorItem.name).toArray();
    }
}
