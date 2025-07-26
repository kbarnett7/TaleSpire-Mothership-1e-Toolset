export class EquipmentItemFormFieldsDto {
    public name: string;
    public description: string;
    public cost: string;

    constructor(name?: string, description?: string, cost?: string) {
        this.name = name ?? "";
        this.description = description ?? "";
        this.cost = cost ?? "0";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): EquipmentItemFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new EquipmentItemFormFieldsDto(json.name ?? "", json.description ?? "", json.cost ?? "0");
    }
}
