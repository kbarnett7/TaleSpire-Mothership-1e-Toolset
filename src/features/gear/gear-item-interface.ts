export interface IGearItem {
    id: number;
    name: string;
}

export interface IEquipmentItem extends IGearItem {
    description: string;
    cost: number;
}

export interface IWeapon extends IEquipmentItem {
    category: string,
    range: string,
    damage: string,
    shots: number,
    wound: string,
    special: string
}

export interface IPatch extends IGearItem {}
export interface ITrinket extends IGearItem {}