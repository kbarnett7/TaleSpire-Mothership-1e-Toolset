import { PlayerCharacter } from "../../features/player-characters/player-character";
import { BaseFormComponent } from "../base-form/base-form-component";

export abstract class BaseNewPlayerCharacterWizardComponent extends BaseFormComponent {
    public abstract setInitialFormValuesUsingPlayerCharacter(playerCharacter: PlayerCharacter): void;
}
