import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { DatabaseEntity } from "../../lib/common/features/database-entity";
import { NpcAttack } from "./npc-attack";
import { NpcSpecialAbility } from "./npc-special-ability";

export class Npc extends DatabaseEntity {
    public sourceId: number;
    public name: string;
    public description: string;
    public combat: number;
    public instinct: number;
    public armorPoints: number;
    public health: number;
    public maximumWounds: number;
    public attacks: NpcAttack[];
    public specialAbilities: NpcSpecialAbility[];

    private validationResults: string[];

    constructor(
        id?: number,
        sourceId?: number,
        name?: string,
        description?: string,
        combat?: number,
        instinct?: number,
        armorPoints?: number,
        health?: number,
        maximumWounds?: number,
        attacks?: NpcAttack[],
        specialAbilities?: NpcSpecialAbility[]
    ) {
        super(id);
        this.sourceId = sourceId ?? 0;
        this.name = name ?? "";
        this.description = description ?? "";
        this.combat = combat ?? 0;
        this.instinct = instinct ?? 0;
        this.armorPoints = armorPoints ?? 0;
        this.health = health ?? 0;
        this.maximumWounds = maximumWounds ?? 0;
        this.attacks = attacks ?? [];
        this.specialAbilities = specialAbilities ?? [];
        this.validationResults = [];
    }

    public validate(unitOfWork: IUnitOfWork): string[] {
        this.validationResults.length = 0;

        this.validateName()
            .validateItemDoesNotAlreadyExist(unitOfWork)
            .validateDescription()
            .validateCombat()
            .validateInstinct()
            .validateArmorPoints()
            .validateHealth()
            .validateMaximumWounds()
            .validateAttacks()
            .validateSpecialAbilities();

        return this.validationResults;
    }

    protected validateName(): Npc {
        if (this.name.trim() == "") {
            this.validationResults.push(`The name \"${this.name}\" is invalid. The name cannot be empty.`);
        } else if (this.name.trim().length > 100) {
            this.validationResults.push(
                `The name \"${this.name}\" is invalid. The name must be 100 characters or less.`
            );
        }

        return this;
    }

    protected validateItemDoesNotAlreadyExist(unitOfWork: IUnitOfWork): Npc {
        return this;
    }

    private validateDescription(): Npc {
        if (this.description.trim().length > 5000) {
            this.validationResults.push(
                `The description \"${this.description}\" is invalid. The description must be 5,000 characters or less.`
            );
        }

        return this;
    }

    private validateCombat(): Npc {
        if (this.combat < 0) {
            this.validationResults.push(
                `The combat \"${this.combat}\" is invalid. The combat must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        } else if (this.combat > 100) {
            this.validationResults.push(
                `The combat \"${this.combat}\" is invalid. The combat must be between 0 and 100.`
            );
        }

        return this;
    }

    private validateInstinct(): Npc {
        if (this.instinct < 0) {
            this.validationResults.push(
                `The instinct \"${this.instinct}\" is invalid. The instinct must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        } else if (this.instinct > 100) {
            this.validationResults.push(
                `The instinct \"${this.instinct}\" is invalid. The instinct must be between 0 and 100.`
            );
        }

        return this;
    }

    private validateArmorPoints(): Npc {
        if (this.armorPoints < 0) {
            this.validationResults.push(
                `The armor points \"${this.armorPoints}\" is invalid. The armor points must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        } else if (this.armorPoints > 10) {
            this.validationResults.push(
                `The armor points \"${this.armorPoints}\" is invalid. The armor points must be between 0 and 10.`
            );
        }

        return this;
    }

    private validateHealth(): Npc {
        if (this.health < 0) {
            this.validationResults.push(
                `The health \"${this.health}\" is invalid. The health must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        } else if (this.health > 1000) {
            this.validationResults.push(
                `The health \"${this.health}\" is invalid. The health must be between 0 and 1,000.`
            );
        }

        return this;
    }

    private validateMaximumWounds(): Npc {
        if (this.maximumWounds < 0) {
            this.validationResults.push(
                `The maximum wounds \"${this.maximumWounds}\" is invalid. The maximum wounds must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        } else if (this.maximumWounds > 100) {
            this.validationResults.push(
                `The maximum wounds \"${this.maximumWounds}\" is invalid. The maximum wounds must be between 0 and 100.`
            );
        }

        return this;
    }

    private validateAttacks(): Npc {
        for (const attack of this.attacks) {
            this.validationResults.push(...attack.validate());
        }

        return this;
    }

    private validateSpecialAbilities(): Npc {
        for (const ability of this.specialAbilities) {
            this.validationResults.push(...ability.validate());
        }

        return this;
    }
}
