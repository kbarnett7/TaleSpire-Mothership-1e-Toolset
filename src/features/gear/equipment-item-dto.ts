export class EquipmentItemDto {
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

    static createFromJson(jsonStr: string): EquipmentItemDto {
        const json = JSON.parse(jsonStr);

        return new EquipmentItemDto(json.name ?? "", json.description ?? "", json.cost ?? "0");
    }
}
