import { ArmorItem } from "../../../features/gear/armor-item";

export class DbSet<T> {
    private collection: T[];

    constructor(collection: T[]) {
        this.collection = collection;
    }

    public toArray(): T[] {
        return this.collection;
    }

    public add(newItem: T): void {
        this.collection.push(newItem);
    }
}
