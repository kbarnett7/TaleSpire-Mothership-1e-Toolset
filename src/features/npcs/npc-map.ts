import { Npc } from "./npc";
import { NpcAttack } from "./npc-attack";
import { NpcFormFieldsDto } from "./npc-form-fields-dto";
import { NpcSpecialAbility } from "./npc-special-ability";

export class NpcMap {
    static fromFormFields(formFields: NpcFormFieldsDto): Npc {
        return new Npc(
            0,
            0,
            formFields.name,
            formFields.description,
            !isNaN(Number(formFields.combat)) ? parseInt(formFields.combat) : -1,
            !isNaN(Number(formFields.instinct)) ? parseInt(formFields.instinct) : -1,
            !isNaN(Number(formFields.armorPoints)) ? parseInt(formFields.armorPoints) : -1,
            !isNaN(Number(formFields.health)) ? parseInt(formFields.health) : -1,
            !isNaN(Number(formFields.maximumWounds)) ? parseInt(formFields.maximumWounds) : -1,
            formFields.attacks.map((attack) => new NpcAttack(attack.name, attack.effect)),
            formFields.specialAbilities.map((ability) => new NpcSpecialAbility(ability.name, ability.description))
        );
    }
}
