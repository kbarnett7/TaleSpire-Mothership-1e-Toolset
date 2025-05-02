import { EquipmentItem } from "./equipment-item";
import data from "../../database/equipment.data.json";

export class EquipmentRepository {
    constructor() {}

    public list(): EquipmentItem[] {
        return data;
    }
}
