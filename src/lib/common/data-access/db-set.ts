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

    public remove(entity: T): void {
        const index = this.collection.indexOf(entity);

        if (index !== -1) {
            this.collection.splice(index, 1);
        }
    }
}
