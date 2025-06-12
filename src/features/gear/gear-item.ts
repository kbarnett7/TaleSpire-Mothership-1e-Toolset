export class GearItem {
    public static gearCategory: string = "All";

    public id: number;
    public sourceId: number;
    public name: string;

    constructor(id?: number, sourceId?: number, name?: string) {
        this.id = id ?? 0;
        this.sourceId = sourceId ?? 0;
        this.name = name ?? "";
    }
}
