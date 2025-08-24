import { WeaponItem } from "./weapon-item";
import { WeaponItemFormFieldsDto } from "./weapon-item-form-fields-dto";

export class WeaponItemMap {
    static fromFormFields(formFields: WeaponItemFormFieldsDto): WeaponItem {
        return new WeaponItem(
            0,
            0,
            formFields.name,
            formFields.description,
            !isNaN(Number(formFields.cost)) ? parseInt(formFields.cost) : -1,
            formFields.category,
            formFields.range,
            formFields.damage,
            !isNaN(Number(formFields.shots)) ? parseInt(formFields.shots) : -1,
            formFields.wound,
            formFields.special
        );
    }
}
