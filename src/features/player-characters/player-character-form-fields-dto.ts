export class PlayerCharacterFormFieldsDto {
    public name: string;
    public characterClass: string;
    public description: string;

    constructor(name?: string, characterClass?: string, description?: string) {
        this.name = name ?? "";
        this.characterClass = characterClass ?? "";
        this.description = description ?? "";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): PlayerCharacterFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new PlayerCharacterFormFieldsDto(
            json.name ?? "",
            json.characterClass ?? "",
            json.description ?? ""
        );
    }
}
