import { BaseDto } from "../../lib/dto/base-dto";

export class StatsFormFieldsDto extends BaseDto {
    public strength: string;
    public speed: string;
    public intellect: string;
    public combat: string;

    constructor(strength?: string, speed?: string, intellect?: string, combat?: string) {
        super();
        this.strength = strength ?? "";
        this.speed = speed ?? "";
        this.intellect = intellect ?? "";
        this.combat = combat ?? "";
    }

    static createFromJson(jsonStr: string): StatsFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new StatsFormFieldsDto(json.strength ?? "", json.speed ?? "", json.intellect ?? "", json.combat ?? "");
    }
}
