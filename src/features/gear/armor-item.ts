import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { ArmorSpeed } from "./armor-speed";
import { EquipmentItem } from "./equipment-item";

export class ArmorItem extends EquipmentItem {
    public static gearCategory: string = "Armor";

    public armorPoints: number;
    public oxygen: number;
    public speed: string;
    public special: string;

    constructor(
        id?: number,
        sourceId?: number,
        name?: string,
        description?: string,
        cost?: number,
        armorPoints?: number,
        oxygen?: number,
        speed?: string,
        special?: string
    ) {
        super(id, sourceId, name, description, cost);
        this.armorPoints = armorPoints ?? 0;
        this.oxygen = oxygen ?? 0;
        this.speed = speed ?? "";
        this.special = special ?? "";
    }

    protected validateItemDoesNotAlreadyExist(unitOfWork: IUnitOfWork): ArmorItem {
        const existingItem = unitOfWork.repo(ArmorItem).first((item) => item.name === this.name);

        if (existingItem) {
            this.validationResults.push(this.getItemAlreadyExistsValidationMessage(ArmorItem.gearCategory));
        }

        return this;
    }

    public validate(unitOfWork: IUnitOfWork): string[] {
        super.validate(unitOfWork);

        this.validateArmorPoints().validateOxygen().validateSpeed().validateSpecial();

        return this.validationResults;
    }

    private validateArmorPoints(): ArmorItem {
        if (this.armorPoints < 0) {
            this.validationResults.push(
                `The armor points \"${this.armorPoints}\" is invalid. The armor points must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        }

        return this;
    }

    private validateOxygen(): ArmorItem {
        if (this.oxygen < 0) {
            this.validationResults.push(
                `The oxygen \"${this.oxygen}\" is invalid. The oxygen must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        }

        return this;
    }

    private validateSpeed(): ArmorItem {
        const validSpeeds: string[] = [ArmorSpeed.Normal, ArmorSpeed.Advantage, ArmorSpeed.Disadvantage];

        if (!validSpeeds.find((speed) => speed === this.speed)) {
            this.validationResults.push(
                `The speed \"${this.speed}\" is invalid. The speed must be one of the following values: ${ArmorSpeed.Normal}, ${ArmorSpeed.Advantage}, ${ArmorSpeed.Disadvantage}`
            );
        }

        return this;
    }

    private validateSpecial(): EquipmentItem {
        if (this.special.trim().length > 1000) {
            this.validationResults.push(
                `The special \"${this.special}\" is invalid. The special must be 1,000 characters or less.`
            );
        }

        return this;
    }

    public saveToDatabase(unitOfWork: IUnitOfWork): void {
        this.id = this.generateId(unitOfWork);
        this.sourceId = this.getCustomItemSourceId(unitOfWork);

        unitOfWork.repo(ArmorItem).add(this);
    }

    public deleteFromDatabase(unitOfWork: IUnitOfWork): void {
        unitOfWork.repo(ArmorItem).remove(this);
    }

    protected getLargestItemIdInDatabase(unitOfWork: IUnitOfWork): number {
        const sortedItems = unitOfWork
            .repo(ArmorItem)
            .list()
            .sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }
}
