export class PlayerCharacterFormFieldsDto {
    public name: string;
    public characterClassId: string;
    public description: string;
    public strength: string;
    public speed: string;
    public intellect: string;
    public combat: string;
    public sanity: string;
    public fear: string;
    public body: string;

    constructor(
        name?: string,
        characterClassId?: string,
        description?: string,
        strength?: string,
        speed?: string,
        intellect?: string,
        combat?: string,
        sanity?: string,
        fear?: string,
        body?: string,
    ) {
        this.name = name ?? "";
        this.characterClassId = characterClassId ?? "";
        this.description = description ?? "";
        this.strength = strength ?? "";
        this.speed = speed ?? "";
        this.intellect = intellect ?? "";
        this.combat = combat ?? "";
        this.sanity = sanity ?? "";
        this.fear = fear ?? "";
        this.body = body ?? "";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): PlayerCharacterFormFieldsDto {
        const json = JSON.parse(jsonStr);

        return new PlayerCharacterFormFieldsDto(
            json.name ?? "",
            json.characterClassId ?? "",
            json.description ?? "",
            json.strength ?? "",
            json.speed ?? "",
            json.intellect ?? "",
            json.combat ?? "",
            json.sanity ?? "",
            json.fear ?? "",
            json.body ?? "",
        );
    }
}
