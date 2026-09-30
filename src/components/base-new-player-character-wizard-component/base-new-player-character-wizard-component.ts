import { PlayerCharacter } from "../../features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../features/player-characters/player-character-creation-wizard/player-character-creation-wizard";
import { BaseFormComponent } from "../base-form/base-form-component";

export abstract class BaseNewPlayerCharacterWizardComponent extends BaseFormComponent {
    public abstract initialize(playerCharacter: PlayerCharacter): void;
    public abstract updatePlayer(wizard: PlayerCharacterCreationWizard, formData: FormData): void;
}
