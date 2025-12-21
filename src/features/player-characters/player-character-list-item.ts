export class PlayerCharacterListItem {
    public id: number;
    public name: string;
    public characterClass: string;
    public description: string;

    constructor(id: number, name: string, characterClass: string, description: string) {
        this.id = id;
        this.name = name;
        this.characterClass = characterClass;
        this.description = description;
    }
}
