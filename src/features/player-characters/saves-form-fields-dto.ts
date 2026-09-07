export class SavesFormFieldsDto {
    public sanity: string;
    public fear: string;
    public body: string;

    constructor(sanity?: string, fear?: string, body?: string) {
        this.sanity = sanity ?? "";
        this.fear = fear ?? "";
        this.body = body ?? "";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): SavesFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new SavesFormFieldsDto(json.sanity ?? "", json.fear ?? "", json.body ?? "");
    }
}
