export class NpcAttack {
    public name: string;
    public effect: string;

    constructor(name?: string, effect?: string) {
        this.name = name ?? "";
        this.effect = effect ?? "";
    }
}
