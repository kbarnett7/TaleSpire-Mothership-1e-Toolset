import { GearItem } from "./gear-item";

export class GearRepository {
    constructor() {

    }

    public list(): GearItem[] {
        return [
            {
                id: 1,
                name: "Sword",
                description: "A sharp blade.",
                cost: 100,
            },
            {
                id: 2,
                name: "Shield",
                description: "A sturdy shield.",
                cost: 150,
            },
            {
                id: 3,
                name: "Bow",
                description: "A long-range weapon.",
                cost: 200,
            },
        ];
    }
}