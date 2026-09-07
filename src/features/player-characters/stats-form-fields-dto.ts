export class StatsFormFieldsDto {
    public strength: string;
    public speed: string;
    public intellect: string;
    public combat: string;

    constructor(strength?: string, speed?: string, intellect?: string, combat?: string) {
        this.strength = strength ?? "";
        this.speed = speed ?? "";
        this.intellect = intellect ?? "";
        this.combat = combat ?? "";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): StatsFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new StatsFormFieldsDto(json.strength ?? "", json.speed ?? "", json.intellect ?? "", json.combat ?? "");
    }
}
