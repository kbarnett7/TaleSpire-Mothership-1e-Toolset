export abstract class DatabaseEntity {
    public id: number;

    constructor(id?: number) {
        this.id = id ?? 0;
    }
}
