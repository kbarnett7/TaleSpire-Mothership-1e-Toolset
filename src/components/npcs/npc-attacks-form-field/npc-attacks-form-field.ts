import html from "./npc-attacks-form-field.html";
import { NpcAttackFormFieldsDto } from "../../../features/npcs/npc-attack-form-fields-dto";
import { EventBus } from "../../../lib/events/event-bus";
import { AddNpcAttackButtonClicked } from "../../../lib/events/add-npc-attack-button-clicked";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";
import { BaseDoubleInputRowsTableComponent } from "../../base-double-input-rows-table/base-double-input-rows-table";
import { Npc } from "../../../features/npcs/npc";

export class NpcAttacksFormFieldComponent extends BaseDoubleInputRowsTableComponent<NpcAttackFormFieldsDto> {
    constructor() {
        super("name", "effect", "npcAttacksTableBody", "Delete NPC attack");
    }

    public connectedCallback() {
        this.render(html);

        super.connectedCallback(); // base version does not call this.render();

        EventBus.instance.register(AddNpcAttackButtonClicked.name, this.onAddNpcAttackButtonClicked);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(AddNpcAttackButtonClicked.name, this.onAddNpcAttackButtonClicked);
    }

    public setInitialFormValues(npc: Npc) {
        this._formFieldsDtoMap.clear();
        this._nextRowId = 1;

        for (let i = 0; i < npc.attacks.length; i++) {
            this.addNewTableRow();
            this.setRowInputValues(i + 1, npc.attacks[i].name, npc.attacks[i].effect);
            this._formFieldsDtoMap.set(i + 1, new NpcAttackFormFieldsDto(npc.attacks[i].name, npc.attacks[i].effect));
        }

        this.updateFormValue();
    }

    private onAddNpcAttackButtonClicked: AppEventListener = (event: AppEvent) => {
        if (!this.canAddNewRow()) {
            return;
        }

        const rowId = this.addNewTableRow();

        this._formFieldsDtoMap.set(rowId, new NpcAttackFormFieldsDto());
    };

    protected isDtoValid(dto: NpcAttackFormFieldsDto): boolean {
        return dto.name.length > 0 || dto.effect.length > 0;
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

        dto.effect = (event.target as HTMLInputElement).value;

        this.updateFormValue();
    }
}

customElements.define("npc-attacks-form-field", NpcAttacksFormFieldComponent);
