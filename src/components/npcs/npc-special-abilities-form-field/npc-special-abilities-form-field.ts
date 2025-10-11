import html from "./npc-special-abilities-form-field.html";
import { NpcSpecialAbilityFormFieldsDto } from "../../../features/npcs/npc-special-ability-form-fields-dto";
import { BaseDoubleInputRowsTableComponent } from "../../base-double-input-rows-table/base-double-input-rows-table";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";
import { AddNpcSpecialAbilityButtonClicked } from "../../../lib/events/add-npc-special-ability-button-clicked";

export class NpcSpecialAbilitiesFormFieldComponent extends BaseDoubleInputRowsTableComponent<NpcSpecialAbilityFormFieldsDto> {
    constructor() {
        super("name", "description", "npcSpecialAbilitiesTableBody", "Delete NPC special ability");
    }

    public connectedCallback() {
        this.render(html);

        super.connectedCallback(); // base version does not call this.render();

        EventBus.instance.register(AddNpcSpecialAbilityButtonClicked.name, this.onAddNpcSpecialAbilityButtonClicked);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(AddNpcSpecialAbilityButtonClicked.name, this.onAddNpcSpecialAbilityButtonClicked);
    }

    private onAddNpcSpecialAbilityButtonClicked: AppEventListener = (event: AppEvent) => {
        if (!this.canAddNewRow()) {
            return;
        }

        const rowId = this.addNewTableRow();

        this._formFieldsDtoMap.set(rowId, new NpcSpecialAbilityFormFieldsDto());
    };

    protected isDtoValid(dto: NpcSpecialAbilityFormFieldsDto): boolean {
        return dto.name.length > 0 || dto.description.length > 0;
    }

    protected handleOnInputOneChanged(event: Event, rowId: number) {
        const dto = this._formFieldsDtoMap.get(rowId);

        if (!dto) {
            return;
        }

        dto.name = (event.target as HTMLInputElement).value;

        this.updateFormValue();
    }

    protected handleOnInputTwoChanged(event: Event, rowId: number) {
        const dto = this._formFieldsDtoMap.get(rowId);

        if (!dto) {
            return;
        }

        dto.description = (event.target as HTMLInputElement).value;

        this.updateFormValue();
    }
}

customElements.define("npc-special-abilities-form-field", NpcSpecialAbilitiesFormFieldComponent);
