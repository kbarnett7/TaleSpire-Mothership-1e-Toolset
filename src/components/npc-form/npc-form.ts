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
        this.updateInstinct();
        this.updateHealth();
        this.updateMaximumWounds();
        this.updateArmorPoints();
        this.updateAttacks();
        this.updateSpecialAbilities();
        this.updateDescription();
    }

    private updateNpcName() {
        const paragraph = this.shadow.querySelector("#npcName") as HTMLParagraphElement;
        paragraph.textContent = this.npc.name;
    }

    private updateNpcCombat() {
        const paragraph = this.shadow.querySelector("#npcCombat") as HTMLParagraphElement;
        paragraph.textContent = this.npc.combat.toString();
    }

    private updateInstinct() {
        const paragraph = this.shadow.querySelector("#npcInstinct") as HTMLParagraphElement;
        paragraph.textContent = this.npc.instinct.toString();
    }

    private updateHealth() {
        const paragraph = this.shadow.querySelector("#npcHealth") as HTMLParagraphElement;
        paragraph.textContent = this.npc.health.toString();
    }

    private updateMaximumWounds() {
        const paragraph = this.shadow.querySelector("#npcMaximumWounds") as HTMLParagraphElement;
        paragraph.textContent = this.npc.maximumWounds.toString();
    }

    private updateArmorPoints() {
        const paragraph = this.shadow.querySelector("#npcArmorPoints") as HTMLParagraphElement;
        paragraph.textContent = this.npc.armorPoints.toString();
    }

    private updateAttacks() {
        const container = this.shadow.querySelector("#npcAttacksContainer") as HTMLDivElement;

        container.innerHTML = "";

        for (var attack of this.npc.attacks) {
            const paragraph = document.createElement("p");

            paragraph.className = "text-base leading-relaxed text-black";
            paragraph.textContent = `${attack.name}: ${attack.effect}`;

            container.appendChild(paragraph);
        }
    }

    private updateSpecialAbilities() {
        const container = this.shadow.querySelector("#npcSpecialAbilitiesContainer") as HTMLDivElement;

        container.innerHTML = "";

        for (var ability of this.npc.specialAbilities) {
            const paragraph = document.createElement("p");

            paragraph.className = "text-base leading-relaxed text-black";
            paragraph.textContent = ability.description;

            container.appendChild(paragraph);
        }
    }

    private updateDescription() {
        const paragraph = this.shadow.querySelector("#npcDescription") as HTMLParagraphElement;
        paragraph.textContent = this.npc.description;
    }
}

customElements.define("npc-form", NpcFormComponent);
