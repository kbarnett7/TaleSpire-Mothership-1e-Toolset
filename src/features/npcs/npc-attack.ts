export class NpcAttack {
    public name: string;
    public effect: string;

    private validationResults: string[];

    constructor(name?: string, effect?: string) {
        this.name = name ?? "";
        this.effect = effect ?? "";
        this.validationResults = [];
    }

    public validate(): string[] {
        this.validationResults.length = 0;

        this.validateCompositeFields().validateName().validateEffect();

        return this.validationResults;
    }

    private validateCompositeFields(): NpcAttack {
        if (this.name.trim() === "" && this.effect.trim() === "") {
            this.validationResults.push(
                `NPC attack with name \"${this.name}\" and effect \"${this.effect}\" is invalid. Name and effect cannot both be empty.`
            );
        }

        return this;
    }

    private validateName(): NpcAttack {
        if (this.name.trim().length > 100) {
            this.validationResults.push(
                `NPC attack with name \"${this.name}\" is invalid. The name must be 100 characters or less.`
            );
        }

        return this;
    }

    private validateEffect(): NpcAttack {
        if (this.effect.trim().length > 1000) {
            this.validationResults.push(
                `NPC attack with effect \"${this.effect}\" is invalid. The effect must be 1,000 characters or less.`
            );
        }

        return this;
    }
}
