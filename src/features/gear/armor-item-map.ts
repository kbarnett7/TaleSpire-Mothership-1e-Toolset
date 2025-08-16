import { ArmorItem } from "./armor-item";
import { ArmorItemFormFieldsDto } from "./armor-item-form-fields-dto";

export class ArmorItemMap {
    static fromFormFields(formFields: ArmorItemFormFieldsDto): ArmorItem {
        return new ArmorItem(
            0,
            0,
            formFields.name,
            formFields.description,
            !isNaN(Number(formFields.cost)) ? parseInt(formFields.cost) : -1
        );
    }
}
