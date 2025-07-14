export class DatabaseVersion {
    public id: number;
    public version: string;

    constructor(id?: number, version?: string) {
        this.id = id ?? 0;
        this.version = version ?? "";
    }
}
