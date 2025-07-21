import { EquipmentItem } from "./equipment-item";
import { EquipmentItemFormFields } from "./equipment-item-form-fields";

export class EquipmentItemMap {
    static fromFormFields(formFields: EquipmentItemFormFields): EquipmentItem {
        return new EquipmentItem(
            0,
            0,
            formFields.name,
            formFields.description,
            !isNaN(Number(formFields.cost)) ? parseInt(formFields.cost) : -1
        );
    }
}
