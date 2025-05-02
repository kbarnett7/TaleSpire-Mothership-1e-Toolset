import { ArmorItem } from "./armor-item";

export class ArmorRepository {
    constructor() {}

    public list(): ArmorItem[] {
        return [new ArmorItem(1, "Standard Crew Attire", "Basic clothing.", 100, 1, 0, "Normal")];
    }
}
