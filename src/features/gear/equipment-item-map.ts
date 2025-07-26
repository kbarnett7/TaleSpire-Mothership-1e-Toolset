import { EquipmentItem } from "./equipment-item";
import { EquipmentItemFormFieldsDto } from "./equipment-item-form-fields-dto";

export class EquipmentItemMap {
    static fromFormFields(formFields: EquipmentItemFormFieldsDto): EquipmentItem {
        return new EquipmentItem(
            0,
            0,
            formFields.name,
            formFields.description,
            !isNaN(Number(formFields.cost)) ? parseInt(formFields.cost) : -1
        );
    }
}
