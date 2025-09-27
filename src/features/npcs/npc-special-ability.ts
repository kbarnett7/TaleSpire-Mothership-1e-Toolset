export class NpcSpecialAbility {
    public name: string;
    public description: string;

    private validationResults: string[];

    constructor(name?: string, description?: string) {
        this.name = name ?? "";
        this.description = description ?? "";
        this.validationResults = [];
    }

    public validate(): string[] {
        this.validationResults.length = 0;

        this.validateCompositeFields().validateName().validateDescription();

        return this.validationResults;
    }

    private validateCompositeFields(): NpcSpecialAbility {
        if (this.name.trim() === "" && this.description.trim() === "") {
            this.validationResults.push(
                `NPC special ability with name \"${this.name}\" and description \"${this.description}\" is invalid. Name and description cannot both be empty.`
            );
        }

        return this;
    }

    private validateName(): NpcSpecialAbility {
        if (this.name.trim().length > 100) {
            this.validationResults.push(
                `NPC special ability with name \"${this.name}\" is invalid. The name must be 100 characters or less.`
            );
        }

        return this;
    }

    private validateDescription(): NpcSpecialAbility {
        if (this.description.trim().length > 1000) {
            this.validationResults.push(
                `NPC special ability with description \"${this.description}\" is invalid. The description must be 1,000 characters or less.`
            );
        }

        return this;
    }
}
