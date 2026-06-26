export class PlayerCharacterListItem {
    public id: number;
    public name: string;
    public characterClassId: number;
    public characterClass: string;
    public description: string;

    constructor(id: number, name: string, characterClassId: number, characterClass: string, description: string) {
        this.id = id;
        this.name = name;
        this.characterClassId = characterClassId;
        this.characterClass = characterClass;
        this.description = description;
    }
}
