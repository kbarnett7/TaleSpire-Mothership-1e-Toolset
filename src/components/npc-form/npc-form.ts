import html from "./npc-form.html";
import { BaseComponent } from "../base.component";
import { Npc } from "../../features/npcs/npc";
import { NpcSpecialAbility } from "../../features/npcs/npc-special-ability";

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

        this.setNumericParagraphElement(paragraph, this.npc.combat);
    }

    private updateInstinct() {
        const paragraph = this.shadow.querySelector("#npcInstinct") as HTMLParagraphElement;

        this.setNumericParagraphElement(paragraph, this.npc.instinct);
    }

    private updateHealth() {
        const paragraph = this.shadow.querySelector("#npcHealth") as HTMLParagraphElement;

        this.setNumericParagraphElement(paragraph, this.npc.health);
    }

    private updateMaximumWounds() {
        const paragraph = this.shadow.querySelector("#npcMaximumWounds") as HTMLParagraphElement;

        this.setNumericParagraphElement(paragraph, this.npc.maximumWounds);
    }

    private updateArmorPoints() {
        const paragraph = this.shadow.querySelector("#npcArmorPoints") as HTMLParagraphElement;

        this.setNumericParagraphElement(paragraph, this.npc.armorPoints);
    }

    private updateAttacks() {
        const container = this.shadow.querySelector("#npcAttacksContainer") as HTMLDivElement;

        container.innerHTML = "";

        if (this.npc.attacks.length == 0) {
            this.populateNoAttacksElement(container);
        } else {
            this.populateAttacks(container);
        }
    }

    private populateNoAttacksElement(container: HTMLDivElement) {
        const paragraph = this.createParagraphElement();

        paragraph.textContent = "<this NPC has no attacks>";

        container.appendChild(paragraph);
    }

    private populateAttacks(container: HTMLDivElement) {
        for (var attack of this.npc.attacks) {
            const paragraph = this.createParagraphElement();

            paragraph.textContent = `${attack.name}: ${attack.effect}`;

            container.appendChild(paragraph);
        }
    }

    private updateSpecialAbilities() {
        const container = this.shadow.querySelector("#npcSpecialAbilitiesContainer") as HTMLDivElement;

        container.innerHTML = "";

        if (this.npc.specialAbilities.length == 0) {
            this.populateNoSpecialAbilitiesElement(container);
        } else {
            this.populateSpecialAbilities(container);
        }
    }

    private populateNoSpecialAbilitiesElement(container: HTMLDivElement) {
        const paragraph = this.createParagraphElement();

        paragraph.textContent = "<this NPC has no special abilities>";

        container.appendChild(paragraph);
    }

    private populateSpecialAbilities(container: HTMLDivElement) {
        for (var ability of this.npc.specialAbilities) {
            const paragraph = this.createParagraphElement();

            paragraph.textContent = ability.description;

            container.appendChild(paragraph);
        }
    }

    private updateDescription() {
        const paragraph = this.shadow.querySelector("#npcDescription") as HTMLParagraphElement;
        paragraph.textContent = this.npc.description;
    }

    private setNumericParagraphElement(paragraph: HTMLParagraphElement, value: number) {
        if (value == 0) {
            paragraph.textContent = "-";
        } else {
            paragraph.textContent = value.toString();
        }
    }

    private createParagraphElement() {
        const paragraph = document.createElement("p");

        paragraph.className = "text-base leading-relaxed text-black";

        return paragraph;
    }
}

customElements.define("npc-form", NpcFormComponent);
