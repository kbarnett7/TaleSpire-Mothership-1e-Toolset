import { EquipmentItemFormFieldsDto } from "./equipment-item-form-fields-dto";

export class ArmorItemFormFieldsDto extends EquipmentItemFormFieldsDto {
    constructor(name?: string, description?: string, cost?: string) {
        super(name, description, cost);
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): ArmorItemFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new ArmorItemFormFieldsDto(json.name ?? "", json.description ?? "", json.cost ?? "0");
    }
}
