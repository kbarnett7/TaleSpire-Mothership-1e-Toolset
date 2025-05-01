export interface IGearItem {
    id: number;
    name: string;
}

export interface IEquipmentItem extends IGearItem {
    description: string;
    cost: number;
}