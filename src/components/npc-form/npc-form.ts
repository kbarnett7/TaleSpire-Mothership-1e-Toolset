import html from "./npc-form.html";
import { BaseComponent } from "../base.component";
import { Npc } from "../../features/npcs/npc";

export class NpcFormComponent extends BaseComponent {
    private npc: Npc;

    constructor() {
        super();
        this.npc = new Npc();
    }

    public connectedCallback() {
        this.render(html);
    }

    public setNpc(npc: Npc) {
        this.npc = npc;

        this.updateNpcName();
        this.updateNpcCombat();
    }

    private updateNpcName() {
        const paragraph = this.shadow.querySelector("#npcName") as HTMLParagraphElement;
        paragraph.textContent = this.npc.name;
    }

    private updateNpcCombat() {
        const paragraph = this.shadow.querySelector("#npcCombat") as HTMLParagraphElement;
        paragraph.textContent = this.npc.combat.toString();
    }
}

customElements.define("npc-form", NpcFormComponent);
