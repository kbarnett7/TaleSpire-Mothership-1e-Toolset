import { EquipmentItemFormFieldsDto } from "./equipment-item-form-fields-dto";

export class WeaponItemFormFieldsDto extends EquipmentItemFormFieldsDto {
    public category: string;
    public range: string;
    public damage: string;
    public shots: string;
    public wound: string;
    public special: string;

    constructor(
        name?: string,
        description?: string,
        cost?: string,
        category?: string,
        range?: string,
        damage?: string,
        shots?: string,
        wound?: string,
        special?: string
    ) {
        super(name, description, cost);
        this.category = category ?? "";
        this.range = range ?? "";
        this.damage = damage ?? "";
        this.shots = shots ?? "";
        this.wound = wound ?? "";
        this.special = special ?? "";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): WeaponItemFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new WeaponItemFormFieldsDto(
            json.name ?? "",
            json.description ?? "",
            json.cost ?? "0",
            json.category ?? "0",
            json.range ?? "0",
            json.damage ?? "",
            json.shots ?? "",
            json.wound ?? "",
            json.special ?? ""
        );
    }
}
