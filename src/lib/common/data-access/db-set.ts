import { ArmorItem } from "../../../features/gear/armor-item";

export class DbSet<T> {
    private collection: T[];

    constructor(collection: T[]) {
        this.collection = collection;
    }

    public toArray(): T[] {
        return this.collection;
    }

    public add(entity: T): void {
        this.collection.push(entity);
    }
}
