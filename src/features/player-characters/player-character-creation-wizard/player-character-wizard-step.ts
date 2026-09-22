import { LinearWizardStepBase } from "../../../lib/wizard-state-machine/linear-wizard-step";
import { PlayerCharacter } from "../player-character";

export class PlayerCharacterWizardStep extends LinearWizardStepBase {
    private _uiComponent: string;

    protected playerCharacter: PlayerCharacter;

    public get uiComponent(): string {
        return this._uiComponent;
    }

    constructor(playerCharacter: PlayerCharacter, title?: string, uiComponent?: string) {
        super(title);
        this.playerCharacter = playerCharacter;
        this._uiComponent = uiComponent || "";
    }
}
