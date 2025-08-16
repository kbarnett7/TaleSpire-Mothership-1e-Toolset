import { EquipmentItemFormFieldsDto } from "./equipment-item-form-fields-dto";

export class ArmorItemFormFieldsDto extends EquipmentItemFormFieldsDto {
    public armorPoints: string;
    public oxygen: string;
    public speed: string;
    public special: string;

    constructor(
        name?: string,
        description?: string,
        cost?: string,
        armorPoints?: string,
        oxygen?: string,
        speed?: string,
        special?: string
    ) {
        super(name, description, cost);
        this.armorPoints = armorPoints ?? "0";
        this.oxygen = oxygen ?? "0";
        this.speed = speed ?? "";
        this.special = special ?? "";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): ArmorItemFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new ArmorItemFormFieldsDto(
            json.name ?? "",
            json.description ?? "",
            json.cost ?? "0",
            json.armorPoints ?? "0",
            json.oxygen ?? "0",
            json.speed ?? "",
            json.special ?? ""
        );
    }
}
