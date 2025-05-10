export class SelectedGearItem {
    public id: number;
    public category: string;

    constructor(id?: number, category?: string) {
        this.id = id ?? 0;
        this.category = category ?? "";
    }
}
