export class DbSet<T> {
    private collection: T[];

    constructor(collection: T[]) {
        this.collection = collection;
    }

    public toArray(): T[] {
        return this.collection;
    }
}
