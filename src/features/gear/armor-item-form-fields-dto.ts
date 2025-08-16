import { EquipmentItemFormFieldsDto } from "./equipment-item-form-fields-dto";

export class ArmorItemFormFieldsDto extends EquipmentItemFormFieldsDto {
    public armorPoints: string;

    constructor(name?: string, description?: string, cost?: string, armorPoints?: string) {
        super(name, description, cost);
        this.armorPoints = armorPoints ?? "0";
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
            json.armorPoints ?? "0"
        );
    }
}
