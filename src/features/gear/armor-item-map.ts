import { ArmorItem } from "./armor-item";
import { ArmorItemFormFieldsDto } from "./armor-item-form-fields-dto";

export class ArmorItemMap {
    static fromFormFields(formFields: ArmorItemFormFieldsDto): ArmorItem {
        return new ArmorItem(
            0,
            0,
            formFields.name,
            formFields.description,
            !isNaN(Number(formFields.cost)) ? parseInt(formFields.cost) : -1,
            !isNaN(Number(formFields.armorPoints)) ? parseInt(formFields.armorPoints) : -1,
            !isNaN(Number(formFields.oxygen)) ? parseInt(formFields.oxygen) : -1,
            formFields.speed,
            formFields.special
        );
    }
}
