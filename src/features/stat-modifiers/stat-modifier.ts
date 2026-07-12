export class StatModifier {
    public stat: string;
    public modifier: number;
    public source: string;

    constructor(stat: string, modifier: number, source: string) {
        this.stat = stat;
        this.modifier = modifier;
        this.source = source;
    }
}
