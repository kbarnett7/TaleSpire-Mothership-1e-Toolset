import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { DatabaseEntity } from "../../lib/common/features/database-entity";

export class PlayerCharacter extends DatabaseEntity {
    public name: string;
    public characterClass: string;
    public description: string;
    public strength: number;
    public speed: number;
    public intellect: number;
    public combat: number;

    private validationResults: string[];

    constructor(
        id?: number,
        name?: string,
        characterClass?: string,
        description?: string,
        strength?: number,
        speed?: number,
        intellect?: number,
        combat?: number,
    ) {
        super(id);
        this.name = name ?? "";
        this.characterClass = characterClass ?? "";
        this.description = description ?? "";
        this.strength = strength ?? 0;
        this.speed = speed ?? 0;
        this.intellect = intellect ?? 0;
        this.combat = combat ?? 0;
        this.validationResults = [];
    }

    public getValidationResult(): ReadonlyArray<string> {
        return this.validationResults;
    }

    public validate(unitOfWork: IUnitOfWork): string[] {
        this.validationResults.length = 0;

        this.validateName()
            .validatePlayerCharacterDoesNotAlreadyExist(unitOfWork)
            .validateCharacterClass()
            .validateDescription();

        this.validateStrength();
        this.validateSpeed();
        this.validateIntellect();
        this.validateCombat();

        return this.validationResults;
    }

    private validateName(): PlayerCharacter {
        if (this.name.trim() === "") {
            this.validationResults.push(`The name "${this.name}" is invalid. The name cannot be empty.`);
        } else if (this.name.trim().length > 100) {
            this.validationResults.push(`The name "${this.name}" is invalid. The name must be 100 characters or less.`);
        }

        return this;
    }

    private validatePlayerCharacterDoesNotAlreadyExist(unitOfWork: IUnitOfWork): PlayerCharacter {
        const existing = unitOfWork.repo(PlayerCharacter).first((pc) => pc.name === this.name);

        if (existing && existing.id !== this.id) {
            this.validationResults.push(
                `A player character with the name "${this.name}" already exists. The name must be unique.`,
            );
        }

        return this;
    }

    private validateCharacterClass(): PlayerCharacter {
        if (this.characterClass.trim() === "") {
            this.validationResults.push("The character class cannot be empty.");
        } else if (this.characterClass.trim().length > 100) {
            this.validationResults.push(
                `The character class "${this.characterClass}" is invalid. The character class must be 100 characters or less.`,
            );
        }

        return this;
    }

    private validateDescription(): PlayerCharacter {
        if (this.description.trim().length > 5000) {
            this.validationResults.push(
                `The description is invalid. The description must be 5,000 characters or less.`,
            );
        }

        return this;
    }

    public validateStrength(): boolean {
        if (this.strength < 0) {
            this.validationResults.push(
                `The strength \"${this.strength}\" is invalid. The strength must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.strength > 100) {
            this.validationResults.push(
                `The strength \"${this.strength}\" is invalid. The strength must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateSpeed(): boolean {
        if (this.speed < 0) {
            this.validationResults.push(
                `The speed \"${this.speed}\" is invalid. The speed must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.speed > 100) {
            this.validationResults.push(`The speed \"${this.speed}\" is invalid. The speed must be between 0 and 100.`);

            return false;
        }

        return true;
    }

    public validateIntellect(): boolean {
        if (this.intellect < 0) {
            this.validationResults.push(
                `The intellect \"${this.intellect}\" is invalid. The intellect must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.intellect > 100) {
            this.validationResults.push(
                `The intellect \"${this.intellect}\" is invalid. The intellect must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateCombat(): boolean {
        if (this.combat < 0) {
            this.validationResults.push(
                `The combat \"${this.combat}\" is invalid. The combat must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.combat > 100) {
            this.validationResults.push(
                `The combat \"${this.combat}\" is invalid. The combat must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public saveToDatabase(unitOfWork: IUnitOfWork): void {
        if (this.id === 0) {
            this.addToDatabase(unitOfWork);
        } else {
            this.updateInDatabase(unitOfWork);
        }
    }

    private addToDatabase(unitOfWork: IUnitOfWork): void {
        const repository = unitOfWork.repo(PlayerCharacter);

        this.id = this.generateId(repository);

        repository.add(this);
    }

    private updateInDatabase(unitOfWork: IUnitOfWork): void {
        const repository = unitOfWork.repo(PlayerCharacter);
        const existing = repository.first((pc) => pc.id === this.id) ?? new PlayerCharacter();

        if (existing.id === 0) {
            this.addToDatabase(unitOfWork);
        } else {
            repository.update(existing, this);
        }
    }

    public deleteFromDatabase(unitOfWork: IUnitOfWork): void {
        unitOfWork.repo(PlayerCharacter).remove(this);
    }
}
