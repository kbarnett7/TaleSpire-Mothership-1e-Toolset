export class PlayerCharacterFormFieldsDto {
    public name: string;
    public characterClass: string;
    public description: string;
    public strength: string;
    public speed: string;
    public intellect: string;
    public combat: string;

    constructor(
        name?: string,
        characterClass?: string,
        description?: string,
        strength?: string,
        speed?: string,
        intellect?: string,
        combat?: string,
    ) {
        this.name = name ?? "";
        this.characterClass = characterClass ?? "";
        this.description = description ?? "";
        this.strength = strength ?? "";
        this.speed = speed ?? "";
        this.intellect = intellect ?? "";
        this.combat = combat ?? "";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): PlayerCharacterFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new PlayerCharacterFormFieldsDto(
            json.name ?? "",
            json.characterClass ?? "",
            json.description ?? "",
            json.strength,
            json.speed,
            json.intellect,
            json.combat,
        );
    }
}
