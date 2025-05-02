import { EquipmentItem } from "./equipment-item";
import { IDatabase } from "../../data-access/database-interface";

export class EquipmentRepository {
    private db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    public list(): EquipmentItem[] {
        return this.db.getSet<EquipmentItem>(EquipmentItem.name).toArray();
    }
}
