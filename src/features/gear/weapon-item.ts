import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { EquipmentItem } from "./equipment-item";
import { WeaponCategory } from "./weapon-category";
import { WeaponRange } from "./weapon-range";

export class WeaponItem extends EquipmentItem {
    public static gearCategory: string = "Weapon";

    public category: string;
    public range: string;
    public damage: string;
    public shots: number;
    public wound: string;
    public special: string;

    constructor(
        id?: number,
        sourceId?: number,
        name?: string,
        description?: string,
        cost?: number,
        category?: string,
        range?: string,
        damage?: string,
        shots?: number,
        wound?: string,
        special?: string
    ) {
        super(id, sourceId, name, description, cost);
        this.category = category ?? WeaponCategory.Melee;
        this.range = range ?? WeaponRange.Adjacent;
        this.damage = damage ?? "";
        this.shots = shots ?? 0;
        this.wound = wound ?? "";
        this.special = special ?? "";
    }

    protected override validateItemDoesNotAlreadyExist(unitOfWork: IUnitOfWork): WeaponItem {
        const existingItem = unitOfWork.repo(WeaponItem).first((item) => item.name === this.name);

        if (existingItem && existingItem.id !== this.id) {
            this.validationResults.push(this.getItemAlreadyExistsValidationMessage(WeaponItem.gearCategory));
        }

        return this;
    }

    public validate(unitOfWork: IUnitOfWork): string[] {
        super.validate(unitOfWork);

        this.validateCategory().validateRange().validateDamage().validateShots().validateWound().validateSpecial();

        return this.validationResults;
    }

    private validateCategory(): WeaponItem {
        const validCategories: string[] = [
            WeaponCategory.Melee,
            WeaponCategory.Firearm,
            WeaponCategory.IndustrialEquipment,
        ];

        if (!validCategories.find((category) => category === this.category)) {
            this.validationResults.push(
                `The weapon category \"${this.category}\" is invalid. The weapon category must be one of the following values: ${WeaponCategory.Melee}, ${WeaponCategory.Firearm}, ${WeaponCategory.IndustrialEquipment}`
            );
        }

        return this;
    }

    private validateRange(): WeaponItem {
        const validCategories: string[] = [
            WeaponRange.Adjacent,
            WeaponRange.Close,
            WeaponRange.Long,
            WeaponRange.Extreme,
        ];

        if (!validCategories.find((range) => range === this.range)) {
            this.validationResults.push(
                `The range \"${this.range}\" is invalid. The range must be one of the following values: ${WeaponRange.Adjacent}, ${WeaponRange.Close}, ${WeaponRange.Long}, ${WeaponRange.Extreme}`
            );
        }

        return this;
    }

    private validateDamage(): WeaponItem {
        if (this.damage.trim().length > 100) {
            this.validationResults.push(
                `The damage \"${this.damage}\" is invalid. The damage must be 100 characters or less.`
            );
        }

        return this;
    }

    private validateShots(): WeaponItem {
        if (this.shots < 0) {
            this.validationResults.push(
                `The shots \"${this.shots}\" is invalid. The shots must be greater than or equal to zero, and it must only contain digits (no decimals or other special characters).`
            );
        }

        return this;
    }

    private validateWound(): WeaponItem {
        if (this.wound.trim().length > 100) {
            this.validationResults.push(
                `The wound \"${this.wound}\" is invalid. The wound must be 100 characters or less.`
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

    protected override addToDatabase(unitOfWork: IUnitOfWork): void {
        this.id = this.generateId(unitOfWork);
        this.sourceId = this.getCustomItemSourceId(unitOfWork);

        unitOfWork.repo(WeaponItem).add(this);
    }

    protected override updateInDatabase(unitOfWork: IUnitOfWork): void {
        const repository = unitOfWork.repo(WeaponItem);
        const existingItem = repository.first((item) => item.id === this.id) ?? new WeaponItem();

        if (existingItem.id === 0) {
            this.addToDatabase(unitOfWork);
        } else {
            repository.update(existingItem, this);
        }
    }

    public override deleteFromDatabase(unitOfWork: IUnitOfWork): void {
        unitOfWork.repo(WeaponItem).remove(this);
    }

    protected override getLargestItemIdInDatabase(unitOfWork: IUnitOfWork): number {
        const sortedItems = unitOfWork
            .repo(WeaponItem)
            .list()
            .sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }
}
