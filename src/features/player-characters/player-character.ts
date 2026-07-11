import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { DatabaseEntity } from "../../lib/common/features/database-entity";
import { GetCharacterClassByIdFeature } from "../character-class/get-character-class-by-id/get-character-class-by-id-feature";
import { GetCharacterClassByIdRequest } from "../character-class/get-character-class-by-id/get-character-class-by-id-request";
import { StatModifier } from "../stat-modifiers/stat-modifier";

export class PlayerCharacter extends DatabaseEntity {
    public name: string;
    public characterClassId: number;
    public description: string;
    public baseStrength: number;
    public baseSpeed: number;
    public baseIntellect: number;
    public baseCombat: number;
    public baseSanity: number;
    public baseFear: number;
    public baseBody: number;

    private statModifiers: StatModifier[];
    private validationResults: string[];

    public get strength(): number {
        return this.getCalculatedStat("strength", this.baseStrength);
    }

    public get speed(): number {
        return this.baseSpeed + 5;
    }

    public get intellect(): number {
        return this.baseIntellect + 5;
    }

    public get combat(): number {
        return this.getCalculatedStat("combat", this.baseCombat);
    }

    public get sanity(): number {
        return this.baseSanity + 10;
    }

    public get fear(): number {
        return this.baseFear + 10;
    }

    public get body(): number {
        return this.baseBody + 10;
    }

    constructor(
        id?: number,
        name?: string,
        characterClassId?: number,
        description?: string,
        baseStrength?: number,
        baseSpeed?: number,
        baseIntellect?: number,
        baseCombat?: number,
        baseSanity?: number,
        baseFear?: number,
        baseBody?: number,
    ) {
        super(id);
        this.name = name ?? "";
        this.characterClassId = characterClassId ?? 0;
        this.description = description ?? "";
        this.baseStrength = baseStrength ?? 0;
        this.baseSpeed = baseSpeed ?? 0;
        this.baseIntellect = baseIntellect ?? 0;
        this.baseCombat = baseCombat ?? 0;
        this.baseSanity = baseSanity ?? 0;
        this.baseFear = baseFear ?? 0;
        this.baseBody = baseBody ?? 0;
        this.statModifiers = [];
        this.validationResults = [];
    }

    public getValidationResult(): ReadonlyArray<string> {
        return this.validationResults;
    }

    public validate(unitOfWork: IUnitOfWork): string[] {
        this.validationResults.length = 0;

        this.validateName().validatePlayerCharacterDoesNotAlreadyExist(unitOfWork).validateDescription();

        this.validateCharacterClass(unitOfWork);
        this.validateBaseStrength();
        this.validateBaseSpeed();
        this.validateBaseIntellect();
        this.validateBaseCombat();
        this.validateBaseSanity();
        this.validateBaseFear();
        this.validateBaseBody();

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

    public validateCharacterClass(unitOfWork: IUnitOfWork): boolean {
        if (this.characterClassId <= 0) {
            this.validationResults.push("A class must be selected.");

            return false;
        } else {
            const getByIdFeature = new GetCharacterClassByIdFeature(unitOfWork);
            const characterClass = getByIdFeature.handle(new GetCharacterClassByIdRequest(this.characterClassId));

            if (characterClass.id <= 0) {
                this.validationResults.push(`The selected class is invalid.`);

                return false;
            }
        }

        return true;
    }

    private validateDescription(): PlayerCharacter {
        if (this.description.trim().length > 5000) {
            this.validationResults.push(
                `The description is invalid. The description must be 5,000 characters or less.`,
            );
        }

        return this;
    }

    public validateBaseStrength(): boolean {
        if (this.baseStrength < 0) {
            this.validationResults.push(
                `The base strength \"${this.baseStrength}\" is invalid. The base strength must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.baseStrength > 100) {
            this.validationResults.push(
                `The base strength \"${this.baseStrength}\" is invalid. The base strength must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateBaseSpeed(): boolean {
        if (this.baseSpeed < 0) {
            this.validationResults.push(
                `The base speed \"${this.baseSpeed}\" is invalid. The base speed must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.baseSpeed > 100) {
            this.validationResults.push(
                `The base speed \"${this.baseSpeed}\" is invalid. The base speed must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateBaseIntellect(): boolean {
        if (this.baseIntellect < 0) {
            this.validationResults.push(
                `The base intellect \"${this.baseIntellect}\" is invalid. The base intellect must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.baseIntellect > 100) {
            this.validationResults.push(
                `The base intellect \"${this.baseIntellect}\" is invalid. The base intellect must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateBaseCombat(): boolean {
        if (this.baseCombat < 0) {
            this.validationResults.push(
                `The base combat \"${this.baseCombat}\" is invalid. The base combat must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.baseCombat > 100) {
            this.validationResults.push(
                `The base combat \"${this.baseCombat}\" is invalid. The base combat must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateBaseSanity(): boolean {
        if (this.baseSanity < 0) {
            this.validationResults.push(
                `The base sanity \"${this.baseSanity}\" is invalid. The base sanity must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.baseSanity > 100) {
            this.validationResults.push(
                `The base sanity \"${this.baseSanity}\" is invalid. The base sanity must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateBaseFear(): boolean {
        if (this.baseFear < 0) {
            this.validationResults.push(
                `The base fear \"${this.baseFear}\" is invalid. The base fear must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.baseFear > 100) {
            this.validationResults.push(
                `The base fear \"${this.baseFear}\" is invalid. The base fear must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public validateBaseBody(): boolean {
        if (this.baseBody < 0) {
            this.validationResults.push(
                `The base body \"${this.baseBody}\" is invalid. The base body must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`,
            );

            return false;
        } else if (this.baseBody > 100) {
            this.validationResults.push(
                `The base body \"${this.baseBody}\" is invalid. The base body must be between 0 and 100.`,
            );

            return false;
        }

        return true;
    }

    public addStatModifiers(statModifiers: StatModifier[]) {
        statModifiers.forEach((modifier) => this.statModifiers.push(modifier));
    }

    private getCalculatedStat(statName: string, statBase: number): number {
        let calculatedStat = statBase;

        this.statModifiers.forEach((statModifier) => {
            if (statModifier.stat === statName) {
                calculatedStat += statModifier.modifier;
            }
        });

        return calculatedStat;
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
