import html from "./roll-saves.html";
import { SavesFormFieldsDto } from "../../features/player-characters/saves-form-fields-dto";
import { BaseNewPlayerCharacterWizardComponent } from "../base-new-player-character-wizard-component/base-new-player-character-wizard-component";
import { PlayerCharacter } from "../../features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../features/player-characters/player-character-creation-wizard/player-character-creation-wizard";

export class RollSavesComponent extends BaseNewPlayerCharacterWizardComponent {
    constructor() {
        super(new SavesFormFieldsDto());
    }

    public connectedCallback() {
        this.render(html);
        this.updateFormValue();
    }

    public initialize(playerCharacter: PlayerCharacter) {
        // this.setInitialFormValues(
        //     new StatsFormFieldsDto(
        //         playerCharacter.baseStrength?.toString() ?? "",
        //         playerCharacter.baseSpeed?.toString() ?? "",
        //         playerCharacter.baseIntellect?.toString() ?? "",
        //         playerCharacter.baseCombat?.toString() ?? "",
        //     ),
        // );
    }

    public setInitialFormValues(dto: SavesFormFieldsDto) {
        // this.setStrength(dto.strength);
        // this.setSpeed(dto.speed);
        // this.setIntellect(dto.intellect);
        // this.setCombat(dto.combat);
        this.updateFormValue();
    }

    public updatePlayer(wizard: PlayerCharacterCreationWizard, formData: FormData) {
        const dto = this.getDtoFromFormData(formData);
        // wizard.setBaseStats(Number(dto.strength), Number(dto.speed), Number(dto.intellect), Number(dto.combat));
    }

    private getDtoFromFormData(formData: FormData): SavesFormFieldsDto {
        return SavesFormFieldsDto.createFromJson(
            formData.get("formFields")?.toString() ?? new SavesFormFieldsDto().toJson(),
        );
    }

    public handleOnShotsInputChanged(event: Event) {
        //this._formFieldsDto.shots = this.shotsInputElement.value;
        this.updateFormValue();
    }
}

customElements.define("roll-saves", RollSavesComponent);
