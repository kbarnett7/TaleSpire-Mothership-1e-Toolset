import { EquipmentItem } from "./equipment-item";

export class EquipmentRepository {
    constructor() {}

    public list(): EquipmentItem[] {
        return [
            new EquipmentItem(
                1,
                "Assorted Tools",
                "Wrenches, spanners, screwdrivers, etc. Can be used as weapons in a pinch (1d5 DMG).",
                20
            ),
        ];
    }
}
