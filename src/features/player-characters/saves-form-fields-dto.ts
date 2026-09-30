import { BaseDto } from "../../lib/dto/base-dto";

export class SavesFormFieldsDto extends BaseDto {
    public sanity: string;
    public fear: string;
    public body: string;

    constructor(sanity?: string, fear?: string, body?: string) {
        super();
        this.sanity = sanity ?? "";
        this.fear = fear ?? "";
        this.body = body ?? "";
    }

    static createFromJson(jsonStr: string): SavesFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new SavesFormFieldsDto(json.sanity ?? "", json.fear ?? "", json.body ?? "");
    }
}
